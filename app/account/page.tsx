import { getCustomer } from 'lib/bigcommerce';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
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
      <div className="mb-10 flex flex-col justify-between border-b border-gray-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            My Account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Welcome back, {firstName}! Manage your account details below.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Profile Details</h2>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {firstName} {lastName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">{email}</dd>
              </div>
              {phone && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{phone}</dd>
                </div>
              )}
              {company && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">{company}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Addresses and Orders */}
        <div className="space-y-16 lg:col-span-2">
          {/* Order History */}
          <section>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Order History</h2>
            {orders.edges.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <ul role="list" className="divide-y divide-gray-200">
                  {orders.edges.map(({ node: order }) => (
                    <li
                      key={order.entityId}
                      className="p-6 transition-colors hover:bg-gray-50 sm:p-8"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Order #{order.entityId}
                          </p>
                          <p className="text-sm text-gray-500">
                            Placed on {new Date(order.orderedAt.utc).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {order.totalIncTax.currencyCode} {order.totalIncTax.value.toFixed(2)}
                          </p>
                          <span className="mt-1 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            {order.status.value}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
                <h3 className="text-sm font-semibold text-gray-900">No orders</h3>
                <p className="mt-1 text-sm text-gray-500">
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

          {/* Addresses */}
          <section>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Address Book</h2>
            {addresses.edges.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {addresses.edges.map(({ node: address }) => (
                  <div
                    key={address.entityId}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <p className="font-medium text-gray-900">
                      {address.firstName} {address.lastName}
                    </p>
                    <address className="mt-3 text-sm not-italic leading-relaxed text-gray-600">
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
                    {address.phone && <p className="mt-3 text-sm text-gray-600">{address.phone}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
                <h3 className="text-sm font-semibold text-gray-900">No addresses</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven&apos;t saved any addresses yet.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
