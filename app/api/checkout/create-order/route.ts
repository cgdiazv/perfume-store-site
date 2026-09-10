import { createBigCommerceOrder } from 'lib/bigcommerce/order';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    if (!payload.checkoutId) {
      return NextResponse.json(
        { error: 'Checkout ID is required.' },
        { status: 400 }
      );
    }

    if (!payload.shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required.' },
        { status: 400 }
      );
    }

    const result = await createBigCommerceOrder(payload);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to place order.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: result.orderId
    });
  } catch (error: any) {
    console.error('Error in create-order API route:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error while placing order.' },
      { status: 500 }
    );
  }
}
