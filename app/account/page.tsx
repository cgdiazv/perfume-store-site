import EditAddressModal from 'components/account/edit-address-modal';
import EditProfileModal from 'components/account/edit-profile-modal';
import { getCustomer } from 'lib/bigcommerce';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogoutButton from './logout-button';

export const metadata = {
  title: 'My Account',
  description: 'Manage your profile, addresses, and view your order history.'
};

export default async function AccountPage() {
  const customerToken = cookies().get('bc_customer_token')?.value;
  console.log('Account Page - customerToken:', customerToken);

  if (!customerToken) {
    console.log('Account Page - No token, redirecting to login');
    redirect('/login');
  }

  console.log('Account Page - Fetching customer data...');
  const customer = await getCustomer(customerToken);
  console.log('Account Page - Fetch complete. Customer:', customer ? 'Found' : 'Null');

  if (!customer) {
    console.log('Account Page - Customer is null, rendering error state');
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Unable to load account</h1>
        <p className="mt-4 text-gray-600">
          We could not load your account data. Your session may have expired, or the BigCommerce API
          returned empty data.
        </p>
        <p className="mt-2 text-sm text-gray-500">Token present: {customerToken ? 'Yes' : 'No'}</p>
        <a href="/login" className="mt-6 inline-block text-[#b42e31] underline">
          Return to Login
        </a>
      </div>
    );
  }

  const { firstName, lastName, email, phone, company, addresses, orders } = customer;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col justify-between border-b border-gray-200 dark:border-neutral-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            My Account
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
            Welcome back, {firstName}! Manage your account details below.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-3">
        {/* Left Column: Profile Details & Address Book */}
        <div className="space-y-12 lg:col-span-1">
          {/* Profile Details */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Details</h2>
              <EditProfileModal
                customerId={customer.entityId}
                firstName={firstName}
                lastName={lastName}
                phone={phone}
                company={company}
              />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#181412]">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-neutral-400">Full Name</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {firstName} {lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-neutral-400">Email Address</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{email}</dd>
                </div>
                {phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-neutral-400">Phone Number</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{phone}</dd>
                  </div>
                )}
                {company && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-neutral-400">Company</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{company}</dd>
                  </div>
                )}
              </dl>
            </div>
          </section>

          {/* Address Book */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Address Book</h2>
              <EditAddressModal customerId={customer.entityId} mode="add" />
            </div>
            {addresses.edges.length > 0 ? (
              <div className="flex flex-col gap-6">
                {addresses.edges.map(({ node: address }) => (
                  <div
                    key={address.entityId}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-[#181412]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {address.firstName} {address.lastName}
                      </p>
                      <EditAddressModal customerId={customer.entityId} address={address} mode="edit" />
                    </div>
                    <address className="mt-3 text-sm not-italic leading-relaxed text-gray-600 dark:text-neutral-300">
                      {address.address1}
                      <br />
                      {address.address2 && (
                        <>
                          {address.address2}
                          <br />
                        </>
                      )}
                      {address.city}, {address.stateOrProvince} {address.postalCode}
                      <br />
                      {address.countryCode}
                    </address>
                    {address.phone && <p className="mt-3 text-sm text-gray-600 dark:text-neutral-400">{address.phone}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center dark:border-neutral-800 dark:bg-[#181412]">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">No addresses</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                  You haven&apos;t saved any addresses yet.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2">
          <section>
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Order History</h2>
            {orders.edges.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#181412]">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-neutral-800">
                  {orders.edges.map(({ node: order }) => (
                    <li
                      key={order.entityId}
                      className="p-6 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-900/50 sm:p-8"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Order #{order.entityId}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-neutral-400">
                            Placed on {new Date(order.orderedAt.utc).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.totalIncTax.currencyCode} {order.totalIncTax.value.toFixed(2)}
                          </p>
                          <span className="mt-1 inline-flex items-center rounded-full bg-gray-100 dark:bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-neutral-200">
                            {order.status.value}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center dark:border-neutral-800 dark:bg-[#181412]">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">No orders</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                  You haven&apos;t placed any orders yet.
                </p>
                <div className="mt-6">
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-full bg-[#b42e31] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#8f2226]"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
