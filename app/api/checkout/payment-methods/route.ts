import { getCheckoutPaymentMethods } from 'lib/bigcommerce/payment';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const checkoutId = searchParams.get('checkoutId') || undefined;

    const paymentMethods = await getCheckoutPaymentMethods({ checkoutId });

    return NextResponse.json({
      success: true,
      paymentMethods
    });
  } catch (error: any) {
    console.error('Error in payment-methods route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch payment methods.' },
      { status: 500 }
    );
  }
}
