import { createBigCommerceOrder } from 'lib/bigcommerce/order';
import { sendOrderConfirmationEmails } from 'lib/email/order-confirmation';
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

    // Send confirmation emails asynchronously or await to ensure delivery
    if (result.orderId) {
      try {
        const customerEmail =
          payload.customerEmail ||
          payload.billingAddress?.email ||
          payload.shippingAddress?.email;
        const customerName =
          `${payload.billingAddress?.firstName || payload.shippingAddress?.firstName || ''} ${
            payload.billingAddress?.lastName || payload.shippingAddress?.lastName || ''
          }`.trim() || 'Customer';

        await sendOrderConfirmationEmails(result.orderId, {
          customerName,
          customerEmail,
          paymentMethod: payload.paymentMethodName,
          orderComments: payload.orderComments,
          shippingAddress: {
            name: `${payload.shippingAddress?.firstName || ''} ${
              payload.shippingAddress?.lastName || ''
            }`.trim(),
            street: [payload.shippingAddress?.address1, payload.shippingAddress?.address2]
              .filter(Boolean)
              .join(', '),
            city: payload.shippingAddress?.city || '',
            state: payload.shippingAddress?.stateOrProvince || '',
            zip: payload.shippingAddress?.postalCode || '',
            country: payload.shippingAddress?.countryCode || 'United States'
          },
          billingAddress: {
            name: customerName,
            street: [
              payload.billingAddress?.address1 || payload.shippingAddress?.address1,
              payload.billingAddress?.address2 || payload.shippingAddress?.address2
            ]
              .filter(Boolean)
              .join(', '),
            city: payload.billingAddress?.city || payload.shippingAddress?.city || '',
            state:
              payload.billingAddress?.stateOrProvince ||
              payload.shippingAddress?.stateOrProvince ||
              '',
            zip: payload.billingAddress?.postalCode || payload.shippingAddress?.postalCode || '',
            country:
              payload.billingAddress?.countryCode ||
              payload.shippingAddress?.countryCode ||
              'United States'
          }
        });
      } catch (emailErr) {
        console.error('Error sending order confirmation emails:', emailErr);
      }
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
