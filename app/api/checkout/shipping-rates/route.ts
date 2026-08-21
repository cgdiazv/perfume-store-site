import { createOrUpdateCheckoutConsignment } from 'lib/bigcommerce/shipping';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { checkoutId, shippingAddress } = await req.json();

    if (!checkoutId || !shippingAddress) {
      return NextResponse.json(
        { error: 'Checkout ID and shipping address are required.' },
        { status: 400 }
      );
    }

    const { consignmentId, shippingOptions } = await createOrUpdateCheckoutConsignment({
      checkoutId,
      shippingAddress
    });

    return NextResponse.json({
      success: true,
      consignmentId,
      shippingOptions
    });
  } catch (error: any) {
    console.error('Error fetching shipping rates:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch shipping rates.' },
      { status: 500 }
    );
  }
}
