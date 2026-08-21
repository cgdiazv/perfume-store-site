import { updateConsignmentShippingOption } from 'lib/bigcommerce/shipping';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { checkoutId, consignmentId, shippingOptionId } = await req.json();

    if (!checkoutId || !consignmentId || !shippingOptionId) {
      return NextResponse.json(
        { error: 'checkoutId, consignmentId, and shippingOptionId are required.' },
        { status: 400 }
      );
    }

    const updatedCosts = await updateConsignmentShippingOption({
      checkoutId,
      consignmentId,
      shippingOptionId
    });

    return NextResponse.json({
      success: true,
      costs: updatedCosts
    });
  } catch (error: any) {
    console.error('Error selecting shipping option:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to apply selected shipping option.' },
      { status: 500 }
    );
  }
}
