import { registerCustomer } from 'lib/bigcommerce/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, phone, company, businessTaxId } =
      await req.json();

    if (!firstName || !lastName || !email || !password || !phone || !company || !businessTaxId) {
      return NextResponse.json(
        {
          error:
            'First name, last name, email, password, phone, company name, and EIN are required.'
        },
        { status: 400 }
      );
    }

    const result = await registerCustomer({
      firstName,
      lastName,
      email,
      password,
      phone,
      company,
      businessTaxId
    });

    return NextResponse.json({ success: true, customer: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? 'Unable to create customer account.' },
      { status: 400 }
    );
  }
}
