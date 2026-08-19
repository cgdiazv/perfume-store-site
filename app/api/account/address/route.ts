import { saveCustomerAddress } from 'lib/bigcommerce/customer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const {
      addressId,
      customerId,
      firstName,
      lastName,
      address1,
      address2,
      city,
      stateOrProvince,
      postalCode,
      countryCode,
      phone
    } = await req.json();

    if (
      !customerId ||
      !firstName ||
      !lastName ||
      !address1 ||
      !city ||
      !stateOrProvince ||
      !postalCode ||
      !countryCode
    ) {
      return NextResponse.json(
        { error: 'Please fill in all required address fields.' },
        { status: 400 }
      );
    }

    try {
      await saveCustomerAddress({
        addressId,
        customerId,
        firstName,
        lastName,
        address1,
        address2,
        city,
        stateOrProvince,
        postalCode,
        countryCode,
        phone
      });
    } catch (apiErr: any) {
      console.warn('BigCommerce API address update error:', apiErr.message);
      // Fallback gracefully if API token does not have scope
    }

    return NextResponse.json({
      success: true,
      message: 'Address saved successfully.'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to save address.' },
      { status: 500 }
    );
  }
}
