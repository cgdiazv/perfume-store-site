import { requestPasswordReset } from 'lib/bigcommerce/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const result = await requestPasswordReset(email);

    // In development return the raw BigCommerce response for debugging
    if (process.env.NODE_ENV !== 'production') {
      // Log to server console for easier inspection
      // eslint-disable-next-line no-console
      console.debug('[forgot-password] BigCommerce response:', result);

      const devErrors = result?.errors;
      if (devErrors && Array.isArray(devErrors) && devErrors.length) {
        return NextResponse.json({ success: false, debug: result }, { status: 400 });
      }

      return NextResponse.json({ success: true, debug: result });
    }

    const errors = result?.errors;
    if (errors && Array.isArray(errors) && errors.length) {
      const msg = errors[0]?.message || 'Unable to process password reset request.';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    // Provide more info in development
    // eslint-disable-next-line no-console
    console.error('[forgot-password] error:', e);
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json(
        { error: 'Unable to request password reset. See debug for details.', debug: String(e) },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unable to request password reset. Please try again.' },
      { status: 500 }
    );
  }
}
