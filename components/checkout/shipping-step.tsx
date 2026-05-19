'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { CheckoutData } from './checkout-form';

interface ShippingStepProps {
  formData: CheckoutData;
  setFormData: Dispatch<SetStateAction<CheckoutData>>;
  onNext: () => void;
  setLoading: (loading: boolean) => void;
}

// Dummy addresses mimicking your database/saved addresses profile data
const SAVED_ADDRESSES = [
  {
    id: 'addr_1',
    firstName: 'Carlos',
    lastName: 'Diaz del Valle',
    phone: '8329558892',
    address1: '2926 Barker Cypress Rd Apt 7111',
    address2: '',
    city: 'Houston',
    stateOrProvince: 'Texas',
    postalCode: '77084',
    countryCode: 'US',
    country: 'United States'
  }
];

export default function ShippingStep({
  formData,
  setFormData,
  onNext,
  setLoading
}: ShippingStepProps) {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(SAVED_ADDRESSES[0]?.id || '');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate short network latency processing payload
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: newAddress
      }));
      setLoading(false);
      onNext();
    }, 600);
  };

  const handleSelectSavedAddress = () => {
    setLoading(true);
    const chosenAddress = SAVED_ADDRESSES.find((a) => a.id === selectedAddressId);

    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: chosenAddress
      }));
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="animate-fadeIn rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
      <h2 className="font-sans text-2xl font-bold uppercase tracking-wide text-black">
        1. Shipping Address
      </h2>

      {!showAddressForm ? (
        /* MODE A: Saved Addresses List (Replaces your Android RecyclerView) */
        <div className="space-y-4">
          {SAVED_ADDRESSES.length === 0 ? (
            <p className="py-4 text-sm text-neutral-500">No saved addresses found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {SAVED_ADDRESSES.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all ${
                    selectedAddressId === addr.id
                      ? 'border-[#a8845e] bg-[#a8845e]/5 ring-1 ring-[#a8845e]'
                      : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="saved_address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-1 h-4 w-4 border-neutral-300 text-[#a8845e] focus:ring-[#a8845e]"
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
              className="w-full rounded-md bg-[#a8845e] py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#8d6d4c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8845e] disabled:opacity-50 sm:w-1/2"
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
              className="rounded-md border bg-transparent p-2.5 text-sm dark:border-neutral-800"
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
              className="rounded-md border bg-transparent p-2.5 text-sm dark:border-neutral-800"
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
              className="rounded-md border bg-transparent p-2.5 text-sm dark:border-neutral-800"
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
              className="rounded-md border bg-transparent p-2.5 text-sm dark:border-neutral-800"
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
              className="rounded-md border bg-transparent p-2.5 text-sm dark:border-neutral-800"
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
              className="rounded-md border bg-transparent p-2.5 text-sm dark:border-neutral-800"
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
              className="rounded-md border bg-transparent p-2.5 text-sm dark:border-neutral-800"
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
              className="rounded-md border bg-transparent p-2.5 text-sm dark:border-neutral-800"
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
              className="rounded-md bg-[#a8845e] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#8d6d4c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8845e]"
            >
              Save & Continue
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
