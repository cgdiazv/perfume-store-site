'use client';

import { useState } from 'react';
import MethodStep from './method-step';
import PaymentStep from './payment-step';
import ShippingStep from './shipping-step';

export type CheckoutData = {
  checkoutId: string;
  shippingAddress: any;
  billingAddress: any;
  sameAsShipping: boolean;
  shippingMethodId: string;
  orderComments: string;
  couponCode: string;
};

export default function CheckoutMasterForm({ initialCheckoutId }: { initialCheckoutId: string }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutData>({
    checkoutId: initialCheckoutId,
    shippingAddress: null,
    billingAddress: null,
    sameAsShipping: true,
    shippingMethodId: '',
    orderComments: '',
    couponCode: ''
  });

  const nextStep = () => setStep((prev) => (prev < 3 ? ((prev + 1) as any) : prev));
  const prevStep = () => setStep((prev) => (prev > 1 ? ((prev - 1) as any) : prev));

  return (
    <div className="relative mx-auto grid max-w-4xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-3">
      {/* Dynamic Processing Overlay (Replaces your XML loading_overlay) */}
      {loading && (
        <div className="bg-black/50 fixed inset-0 z-50 flex animate-fadeIn flex-col items-center justify-center text-white backdrop-blur-sm">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-300 border-t-blue-600" />
          <p className="text-lg font-semibold tracking-wide">Processing your transaction...</p>
        </div>
      )}

      {/* Steps Container Columns */}
      <div className="space-y-6 lg:col-span-2">
        {step === 1 && (
          <ShippingStep
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            setLoading={setLoading}
          />
        )}
        {step === 2 && (
          <MethodStep
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            onBack={prevStep}
            setLoading={setLoading}
          />
        )}
        {step === 3 && (
          <PaymentStep
            formData={formData}
            setFormData={setFormData}
            onBack={prevStep}
            setLoading={setLoading}
          />
        )}
      </div>

      {/* Floating Side Sidebar Panel for Step 3 Summary details */}
      <div className="h-fit rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-4 text-lg font-bold uppercase tracking-wider">Summary</h3>
        {/* We will embed the order line-item map loop right here */}
      </div>
    </div>
  );
}
