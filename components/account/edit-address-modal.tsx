'use client';

import { Dialog, Transition } from '@headlessui/react';
import { PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';

type AddressData = {
  entityId?: number;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  countryCode: string;
  phone?: string;
};

type AddressModalProps = {
  customerId: number;
  address?: AddressData;
  mode: 'add' | 'edit';
};

export default function EditAddressModal({ customerId, address, mode }: AddressModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialForm = {
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    address1: address?.address1 || '',
    address2: address?.address2 || '',
    city: address?.city || '',
    stateOrProvince: address?.stateOrProvince || '',
    postalCode: address?.postalCode || '',
    countryCode: address?.countryCode || 'US',
    phone: address?.phone || ''
  };

  const [formData, setFormData] = useState(initialForm);

  const openModal = () => {
    setFormData(initialForm);
    setError(null);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/account/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: address?.entityId,
          customerId,
          ...formData
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save address.');
      }

      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {mode === 'add' ? (
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#b42e31] hover:underline"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Add Address
        </button>
      ) : (
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#b42e31] dark:text-neutral-400 dark:hover:text-white"
        >
          <PencilIcon className="h-3.5 w-3.5" />
          Edit
        </button>
      )}

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={closeModal} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6 md:p-20">
            <div className="flex min-h-full items-center justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all dark:border dark:border-neutral-800 dark:bg-[#181412]">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
                    <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
                      {mode === 'add' ? 'Add New Address' : 'Edit Address'}
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {error && (
                    <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 dark:bg-red-950/60 dark:text-red-300">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#b42e31] focus:ring-[#b42e31] dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#b42e31] focus:ring-[#b42e31] dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        name="address1"
                        required
                        value={formData.address1}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#b42e31] focus:ring-[#b42e31] dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="address2"
                        value={formData.address2}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#b42e31] focus:ring-[#b42e31] dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#b42e31] focus:ring-[#b42e31] dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
                          State / Province *
                        </label>
                        <input
                          type="text"
                          name="stateOrProvince"
                          required
                          value={formData.stateOrProvince}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#b42e31] focus:ring-[#b42e31] dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          required
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#b42e31] focus:ring-[#b42e31] dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
                          Country Code *
                        </label>
                        <input
                          type="text"
                          name="countryCode"
                          required
                          value={formData.countryCode}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#b42e31] focus:ring-[#b42e31] dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#b42e31] focus:ring-[#b42e31] dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="rounded-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-full bg-[#b42e31] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#8f2226] disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
