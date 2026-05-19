'use client';

import { Dispatch, SetStateAction, useState, useTransition } from 'react';
import { CheckoutData } from './checkout-form';
import { clearCart } from 'components/cart/actions';

interface PaymentStepProps {
  formData: CheckoutData;
  setFormData: Dispatch<SetStateAction<CheckoutData>>;
  onBack: () => void;
  setLoading: (loading: boolean) => void;
}

export default function PaymentStep({
  formData,
  setFormData,
  onBack,
  setLoading
}: PaymentStepProps) {
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [localCoupon, setLocalCoupon] = useState(formData.couponCode);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = () => {
    if (!localCoupon.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, couponCode: localCoupon }));
      setLoading(false);
      alert(`Coupon "${localCoupon}" applied successfully!`);
    }, 500);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert('Please agree to the Terms and Conditions to proceed.');
      return;
    }

    setLoading(true);

    // Simulate sending transaction secure processing payload to BigCommerce
    setTimeout(async () => {
      setLoading(false);
      await clearCart();
      alert('Order placed successfully! Thank you for your purchase.');
      window.location.href = '/search'; // Redirect out to catalog or success landing
    }, 2000);
  };

  return (
    <div className="animate-fadeIn rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
      <h2 className="mb-6 font-sans text-2xl font-bold uppercase tracking-wide text-black">
        3. Payment Method
      </h2>

      <form onSubmit={handlePlaceOrder} className="space-y-6">
        {/* Radio option mimicking your Android layout container selection */}
        <div className="bg-neutral-50/50 flex items-center gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
          <input
            type="radio"
            id="credit_card"
            checked
            readOnly
            className="h-4 w-4 text-[#BF9B30] focus:ring-[#BF9B30]"
          />
          <label
            htmlFor="credit_card"
            className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200"
          >
            Credit / Debit Card
          </label>
        </div>

        {/* Credit Card Input Matrix */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="col-span-full flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Card Number
            </label>
            <input
              type="text"
              name="number"
              placeholder="1234 1234 1234 1234"
              required
              maxLength={19}
              value={cardInfo.number}
              onChange={handleInputChange}
              className="rounded-md border bg-transparent p-2.5 text-sm text-black dark:border-neutral-800 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Expiration Date
            </label>
            <input
              type="text"
              name="expiry"
              placeholder="MM / YY"
              required
              maxLength={5}
              value={cardInfo.expiry}
              onChange={handleInputChange}
              className="rounded-md border bg-transparent p-2.5 text-sm text-black dark:border-neutral-800 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Security Code (CVC)
            </label>
            <input
              type="password"
              name="cvc"
              placeholder="CVC"
              required
              maxLength={4}
              value={cardInfo.cvc}
              onChange={handleInputChange}
              className="rounded-md border bg-transparent p-2.5 text-sm text-black dark:border-neutral-800 dark:text-white"
            />
          </div>
        </div>

        {/* Coupon / Gift Certificate Module */}
        <div className="border-t border-neutral-100 pt-4 dark:border-neutral-900">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">
            Coupon / Gift Certificate
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Optional"
              value={localCoupon}
              onChange={(e) => setLocalCoupon(e.target.value)}
              className="flex-grow rounded-md border bg-transparent p-2.5 text-sm text-black dark:border-neutral-800 dark:text-white"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Terms and Conditions Acceptance Link Block */}
        <div className="space-y-2 pt-2">
          <div className="flex w-fit cursor-pointer items-center gap-1.5 text-sm font-semibold text-[#a8845e] hover:underline">
            <span>Terms and Conditions</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </div>

          <label className="flex cursor-pointer select-none items-center gap-3">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-[#BF9B30] focus:ring-[#BF9B30]"
            />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Yes, I agree with the terms and conditions.
            </span>
          </label>
        </div>

        {/* Step Navigation Button Layout Row */}
        <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-6 dark:border-neutral-900">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold uppercase tracking-wider text-neutral-500 transition-colors hover:text-black dark:hover:text-white"
          >
            Back
          </button>
          <button
            type="submit"
            className="rounded-md bg-[#a8845e] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-sm transition-all hover:bg-[#8d6d4c] hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8845e]"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}
