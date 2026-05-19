'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { CheckoutData } from './checkout-form';

interface MethodStepProps {
  formData: CheckoutData;
  setFormData: Dispatch<SetStateAction<CheckoutData>>;
  onNext: () => void;
  onBack: () => void;
  setLoading: (loading: boolean) => void;
}

// Simulated dynamic shipping rates mapped from carrier accounts configuration
const SHIPPING_METHODS = [
  {
    id: 'sm_1',
    name: 'Standard Delivery',
    description: 'Arrives in 3-5 business days',
    price: 0.0
  },
  { id: 'sm_2', name: 'Express Courier', description: 'Arrives in 1-2 business days', price: 15.0 },
  {
    id: 'sm_3',
    name: 'Next-Day Air Luxury Delivery',
    description: 'Guaranteed delivery tomorrow',
    price: 35.0
  }
];

export default function MethodStep({
  formData,
  setFormData,
  onNext,
  onBack,
  setLoading
}: MethodStepProps) {
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    formData.shippingMethodId || SHIPPING_METHODS[0]?.id || ''
  );
  const [billingAddress, setBillingAddress] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    city: '',
    stateOrProvince: '',
    postalCode: '',
    countryCode: 'US'
  });

  const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, sameAsShipping: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        shippingMethodId: selectedMethodId,
        billingAddress: prev.sameAsShipping ? prev.shippingAddress : billingAddress
      }));
      setLoading(false);
      onNext();
    }, 600);
  };

  return (
    <div className="animate-fadeIn rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
      <h2 className="font-sans text-2xl font-bold uppercase tracking-wide text-black">
        2. Shipping Method & Billing
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Verification Card Header Row */}
        <div className="space-y-1 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
          <p className="font-bold text-black dark:text-white">Selected Destination:</p>
          <p>
            {formData.shippingAddress?.firstName} {formData.shippingAddress?.lastName}
          </p>
          <p>{formData.shippingAddress?.address1}</p>
          <p>
            {formData.shippingAddress?.city}, {formData.shippingAddress?.stateOrProvince}{' '}
            {formData.shippingAddress?.postalCode}
          </p>
        </div>

        {/* Sync Address Selection Checkbox Toggle */}
        <label className="flex cursor-pointer select-none items-center gap-3 py-1">
          <input
            type="checkbox"
            checked={formData.sameAsShipping}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-neutral-300 text-[#BF9B30] focus:ring-[#BF9B30]"
          />
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            My billing address is the same as my shipping address.
          </span>
        </label>

        {/* Conditional Billing Input Box Form Matrix */}
        {!formData.sameAsShipping && (
          <div className="bg-neutral-50/20 animate-slideDown grid grid-cols-1 gap-4 rounded-lg border border-neutral-100 p-4 sm:grid-cols-2 dark:border-neutral-900">
            <h3 className="col-span-full mb-2 text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Billing Address Details
            </h3>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-neutral-400">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={billingAddress.firstName}
                onChange={handleBillingInputChange}
                className="rounded border bg-transparent p-2 text-sm text-black dark:border-neutral-800 dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-neutral-400">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={billingAddress.lastName}
                onChange={handleBillingInputChange}
                className="rounded border bg-transparent p-2 text-sm text-black dark:border-neutral-800 dark:text-white"
              />
            </div>
            <div className="col-span-full flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-neutral-400">
                Address Line 1 *
              </label>
              <input
                type="text"
                name="address1"
                required
                value={billingAddress.address1}
                onChange={handleBillingInputChange}
                className="rounded border bg-transparent p-2 text-sm text-black dark:border-neutral-800 dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-neutral-400">City *</label>
              <input
                type="text"
                name="city"
                required
                value={billingAddress.city}
                onChange={handleBillingInputChange}
                className="rounded border bg-transparent p-2 text-sm text-black dark:border-neutral-800 dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase text-neutral-400">Zip Code *</label>
              <input
                type="text"
                name="postalCode"
                required
                value={billingAddress.postalCode}
                onChange={handleBillingInputChange}
                className="rounded border bg-transparent p-2 text-sm text-black dark:border-neutral-800 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Dynamic Rates Carrier Selector List Box Frame */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
            Available Shipping Methods
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {SHIPPING_METHODS.map((method) => (
              <label
                key={method.id}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${
                  selectedMethodId === method.id
                    ? 'border-[#a8845e] bg-[#a8845e]/5 ring-1 ring-[#a8845e]'
                    : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping_method"
                    checked={selectedMethodId === method.id}
                    onChange={() => setSelectedMethodId(method.id)}
                    className="h-4 w-4 border-neutral-300 text-[#a8845e] focus:ring-[#a8845e]"
                  />
                  <div className="text-sm">
                    <p className="font-bold text-black dark:text-white">{method.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {method.description}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Order Comments Textbox Interface */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
            Order Comments
          </label>
          <textarea
            placeholder="(Optional) Add any specific delivery directions or notes..."
            value={formData.orderComments}
            onChange={(e) => setFormData((prev) => ({ ...prev, orderComments: e.target.value }))}
            className="h-24 w-full resize-none rounded-md border bg-transparent p-3 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#BF9B30] dark:border-neutral-800 dark:text-white"
          />
        </div>

        {/* Step Action Row */}
        <div className="flex items-center justify-between border-t border-neutral-100 pt-6 dark:border-neutral-900">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold uppercase tracking-wider text-neutral-500 transition-colors hover:text-black dark:hover:text-white"
          >
            Back
          </button>
          <button
            type="submit"
            className="rounded-md bg-[#a8845e] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#8d6d4c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8845e]"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
