'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { CheckoutData } from './checkout-form';

interface ShippingStepProps {
  formData: CheckoutData;
  setFormData: Dispatch<SetStateAction<CheckoutData>>;
  onNext: () => void;
  setLoading: (loading: boolean) => void;
  savedAddresses?: any[];
}

export default function ShippingStep({
  formData,
  setFormData,
  onNext,
  setLoading,
  savedAddresses = []
}: ShippingStepProps) {
  const [showAddressForm, setShowAddressForm] = useState(savedAddresses.length === 0);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(savedAddresses[0]?.id || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Local state for the "Add New Address" form matrix
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    stateOrProvince: '',
    postalCode: '',
    countryCode: 'US'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const processShippingAddress = async (targetAddress: any) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      if (formData.checkoutId) {
        const res = await fetch('/api/checkout/shipping-rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkoutId: formData.checkoutId,
            shippingAddress: targetAddress
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setFormData((prev) => ({
            ...prev,
            shippingAddress: targetAddress,
            consignmentId: data.consignmentId,
            availableShippingMethods: data.shippingOptions || []
          }));
          setLoading(false);
          onNext();
          return;
        } else {
          console.warn('Shipping rates fetch error:', data.error);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch dynamic shipping options:', err);
    }

    // Fallback if checkoutId is missing or API failed
    setFormData((prev) => ({
      ...prev,
      shippingAddress: targetAddress
    }));
    setLoading(false);
    onNext();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processShippingAddress(newAddress);
  };

  const handleSelectSavedAddress = () => {
    const chosenAddress = savedAddresses.find((a) => a.id === selectedAddressId);
    if (chosenAddress) {
      processShippingAddress(chosenAddress);
    }
  };

  return (
    <div className="animate-fadeIn rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-[#181412]">
      <h2 className="font-sans text-2xl font-bold uppercase tracking-wide text-black dark:text-white">
        1. Shipping Address
      </h2>
      {errorMsg && (
        <div className="mt-2 rounded bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {errorMsg}
        </div>
      )}

      {!showAddressForm ? (
        /* MODE A: Saved Addresses List (Replaces your Android RecyclerView) */
        <div className="space-y-4">
          {savedAddresses.length === 0 ? (
            <p className="py-4 text-sm text-neutral-500">No saved addresses found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {savedAddresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all ${
                    selectedAddressId === addr.id
                      ? 'border-[#b42e31] bg-[#b42e31]/5 dark:bg-[#b42e31]/15 ring-1 ring-[#b42e31]'
                      : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="saved_address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-1 h-4 w-4 border-neutral-300 text-[#b42e31] focus:ring-[#b42e31]"
                  />
                  <div className="space-y-0.5 text-sm text-neutral-600 dark:text-neutral-400">
                    <p className="font-bold text-black dark:text-white">
                      {addr.firstName} {addr.lastName}
                    </p>
                    <p>{addr.address1}</p>
                    {addr.address2 && <p>{addr.address2}</p>}
                    <p>
                      {addr.city}, {addr.stateOrProvince} {addr.postalCode}
                    </p>
                    <p className="pt-1 text-xs text-neutral-400">Phone: {addr.phone}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Action Row for Selection Mode */}
          <div className="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-6 sm:flex-row dark:border-neutral-900">
            <button
              type="button"
              onClick={() => setShowAddressForm(true)}
              className="w-full rounded-md border border-neutral-200 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-black transition-colors hover:bg-neutral-50 sm:w-1/2 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-900"
            >
              Add New Address
            </button>
            <button
              type="button"
              onClick={handleSelectSavedAddress}
              disabled={!selectedAddressId}
              className="w-full rounded-md bg-[#b42e31] py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#8f2226] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b42e31] disabled:opacity-50 sm:w-1/2"
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        /* MODE B: Add New Address Form Matrix (Replaces your Input Dialogs) */
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={newAddress.firstName}
              onChange={handleInputChange}
              className="rounded-md border bg-transparent p-2.5 text-sm text-black dark:text-white dark:border-neutral-800 dark:bg-neutral-900/60"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={newAddress.lastName}
              onChange={handleInputChange}
              className="rounded-md border bg-transparent p-2.5 text-sm text-black dark:text-white dark:border-neutral-800 dark:bg-neutral-900/60"
            />
          </div>

          <div className="col-span-full flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Address Line 1 *
            </label>
            <input
              type="text"
              name="address1"
              required
              value={newAddress.address1}
              onChange={handleInputChange}
              className="rounded-md border bg-transparent p-2.5 text-sm text-black dark:text-white dark:border-neutral-800 dark:bg-neutral-900/60"
            />
          </div>

          <div className="col-span-full flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              name="address2"
              value={newAddress.address2}
              onChange={handleInputChange}
              className="rounded-md border bg-transparent p-2.5 text-sm text-black dark:text-white dark:border-neutral-800 dark:bg-neutral-900/60"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              City *
            </label>
            <input
              type="text"
              name="city"
              required
              value={newAddress.city}
              onChange={handleInputChange}
              className="rounded-md border bg-transparent p-2.5 text-sm text-black dark:text-white dark:border-neutral-800 dark:bg-neutral-900/60"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              State / Province *
            </label>
            <input
              type="text"
              name="stateOrProvince"
              required
              value={newAddress.stateOrProvince}
              onChange={handleInputChange}
              className="rounded-md border bg-transparent p-2.5 text-sm text-black dark:text-white dark:border-neutral-800 dark:bg-neutral-900/60"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Zip / Postal Code *
            </label>
            <input
              type="text"
              name="postalCode"
              required
              value={newAddress.postalCode}
              onChange={handleInputChange}
              className="rounded-md border bg-transparent p-2.5 text-sm text-black dark:text-white dark:border-neutral-800 dark:bg-neutral-900/60"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={newAddress.phone}
              onChange={handleInputChange}
              className="rounded-md border bg-transparent p-2.5 text-sm text-black dark:text-white dark:border-neutral-800 dark:bg-neutral-900/60"
            />
          </div>

          {/* Action Row for Form Mode */}
          <div className="col-span-full mt-4 flex items-center justify-between border-t border-neutral-100 pt-6 dark:border-neutral-900">
            <button
              type="button"
              onClick={() => setShowAddressForm(false)}
              className="text-sm font-semibold uppercase tracking-wider text-neutral-500 transition-colors hover:text-black dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#b42e31] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#8f2226] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b42e31]"
            >
              Save & Continue
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
