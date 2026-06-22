import { loginCustomer } from 'lib/bigcommerce/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const loginResult = await loginCustomer(email, password);

    if (!loginResult || !loginResult.customerAccessToken?.value) {
      const errorMessage =
        loginResult?.result === 'FAILURE'
          ? 'Invalid login credentials. Please check your email and password.'
          : 'Unable to sign in. Please check your credentials and try again.';
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      customer: loginResult.customer
    });

    response.cookies.set('bc_customer_token', loginResult.customerAccessToken.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error: any) {
    const rawMessage = error?.message || '';
    const isInvalidCredentials = rawMessage.includes('Invalid credentials');
    const errorMessage = isInvalidCredentials
      ? 'Invalid login credentials. Please check your email and password.'
      : 'Unable to authenticate customer. Please try again.';

    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
