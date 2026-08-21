'use client';

import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CheckoutData } from './checkout-form';
import { clearCart } from 'components/cart/actions';
import PasswordInput from 'components/password-input';
import { AvailablePaymentMethod, DEFAULT_PAYMENT_METHODS } from 'lib/bigcommerce/payment';

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
  const [paymentMethods, setPaymentMethods] = useState<AvailablePaymentMethod[]>(
    formData.availablePaymentMethods && formData.availablePaymentMethods.length > 0
      ? formData.availablePaymentMethods
      : DEFAULT_PAYMENT_METHODS
  );
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    formData.paymentMethodId || paymentMethods[0]?.id || 'credit_card'
  );
  const [isFetchingMethods, setIsFetchingMethods] = useState<boolean>(false);

  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [localCoupon, setLocalCoupon] = useState(formData.couponCode);

  useEffect(() => {
    async function fetchPaymentMethods() {
      setIsFetchingMethods(true);
      try {
        const query = formData.checkoutId ? `?checkoutId=${formData.checkoutId}` : '';
        const res = await fetch(`/api/checkout/payment-methods${query}`);
        const data = await res.json();

        if (res.ok && data.success && Array.isArray(data.paymentMethods) && data.paymentMethods.length > 0) {
          setPaymentMethods(data.paymentMethods);
          setFormData((prev) => ({ ...prev, availablePaymentMethods: data.paymentMethods }));
          if (!formData.paymentMethodId) {
            setSelectedMethodId(data.paymentMethods[0].id);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch payment methods from BigCommerce API:', err);
      } finally {
        setIsFetchingMethods(false);
      }
    }

    fetchPaymentMethods();
  }, [formData.checkoutId]);

  const activeMethod =
    paymentMethods.find((m) => m.id === selectedMethodId) ||
    paymentMethods[0] ||
    DEFAULT_PAYMENT_METHODS[0] || {
      id: 'credit_card',
      name: 'Credit / Debit Card',
      type: 'option'
    };

  const isCardMethod =
    activeMethod.id === 'credit_card' ||
    activeMethod.type === 'option' ||
    activeMethod.id.includes('square') ||
    activeMethod.id.includes('stripe') ||
    activeMethod.id.includes('braintree') ||
    activeMethod.id.includes('authorizenet');

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

    // Simulate sending transaction payload for chosen BigCommerce payment method
    setTimeout(async () => {
      setLoading(false);
      await clearCart();
      alert(`Order placed successfully using ${activeMethod.name}! Thank you for your purchase.`);
      window.location.href = '/search';
    }, 2000);
  };

  return (
    <div className="animate-fadeIn rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-[#181412]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-sans text-2xl font-bold uppercase tracking-wide text-black dark:text-white">
          3. Payment Method
        </h2>
        {isFetchingMethods && (
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
            <span>Fetching store methods...</span>
          </div>
        )}
      </div>

      <form onSubmit={handlePlaceOrder} className="space-y-6">
        {/* Dynamic Payment Methods Radio Group */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
            Available Payment Gateways
          </label>

          <div className="grid grid-cols-1 gap-3">
            {paymentMethods.map((method) => {
              const isSelected = selectedMethodId === method.id;
              return (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${
                    isSelected
                      ? 'border-[#b42e31] bg-[#b42e31]/5 ring-1 ring-[#b42e31]'
                      : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.id}
                      checked={isSelected}
                      onChange={() => {
                        setSelectedMethodId(method.id);
                        setFormData((prev) => ({ ...prev, paymentMethodId: method.id }));
                      }}
                      className="h-4 w-4 border-neutral-300 text-[#b42e31] focus:ring-[#b42e31]"
                    />
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                        {method.name}
                      </p>
                      {method.description && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {method.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {method.testMode && (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                      TEST MODE
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Dynamic Form Sections based on selected method type */}
        {isCardMethod ? (
          <div className="animate-fadeIn grid grid-cols-1 gap-4 rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 sm:grid-cols-2 dark:border-neutral-900 dark:bg-neutral-900/30">
            <div className="col-span-full flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Card Number
              </label>
              <input
                type="text"
                name="number"
                placeholder="1234 1234 1234 1234"
                required={isCardMethod}
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
                required={isCardMethod}
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
              <PasswordInput
                name="cvc"
                placeholder="CVC"
                required={isCardMethod}
                maxLength={4}
                value={cardInfo.cvc}
                onChange={handleInputChange}
                className="w-full rounded-md border bg-transparent p-2.5 text-sm text-black dark:border-neutral-800 dark:text-white"
              />
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
            <p className="font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              Payment Instructions for {activeMethod.name}:
            </p>
            <p>
              Complete your order now. You will receive invoice instructions to fulfill payment via {activeMethod.name} once your purchase is recorded.
            </p>
          </div>
        )}

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
          <Link
            href="/terms-and-conditions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit cursor-pointer items-center gap-1.5 text-sm font-semibold text-[#b42e31] hover:underline"
          >
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
          </Link>

          <label className="flex cursor-pointer select-none items-center gap-3">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-[#b42e31] focus:ring-[#b42e31]"
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
            className="rounded-md bg-[#b42e31] px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-sm transition-all hover:bg-[#8f2226] hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b42e31]"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
}
