import { BIGCOMMERCE_API_URL } from 'lib/bigcommerce/constants';
import { Resend } from 'resend';

const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;
const resendApiKey = process.env.RESEND_API_KEY;

const ADMIN_EMAIL = 'ar@perfumestoreatlanta.com';
const FROM_EMAIL = 'Perfume Store <notifications@indevasa.com>';

export type OrderEmailItem = {
  name: string;
  quantity: number;
  price: string | number;
  total: string | number;
  sku?: string;
};

export type OrderEmailDetails = {
  orderId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod: string;
  status: string;
  subtotal: string | number;
  shippingCost: string | number;
  total: string | number;
  items: OrderEmailItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  orderComments?: string;
};

/**
 * Fetches order details directly from BigCommerce v2 Orders API.
 */
async function fetchOrderDetailsFromBigCommerce(orderId: number): Promise<OrderEmailDetails | null> {
  if (!storeHash || !accessToken) return null;

  try {
    const headers = {
      'X-Auth-Token': accessToken,
      Accept: 'application/json'
    };

    // 1. Order details
    const orderRes = await fetch(`${BIGCOMMERCE_API_URL}/stores/${storeHash}/v2/orders/${orderId}`, {
      headers,
      cache: 'no-store'
    });
    if (!orderRes.ok) return null;
    const order = await orderRes.json();

    // 2. Order products
    let items: OrderEmailItem[] = [];
    const prodRes = await fetch(`${BIGCOMMERCE_API_URL}/stores/${storeHash}/v2/orders/${orderId}/products`, {
      headers,
      cache: 'no-store'
    });
    if (prodRes.ok) {
      const prods = await prodRes.json();
      if (Array.isArray(prods)) {
        items = prods.map((p: any) => ({
          name: p.name,
          quantity: p.quantity,
          price: Number(p.base_price || 0).toFixed(2),
          total: Number(p.total_inc_tax || p.total_ex_tax || 0).toFixed(2),
          sku: p.sku
        }));
      }
    }

    // 3. Shipping addresses
    let shipping = {
      name: `${order.billing_address?.first_name || ''} ${order.billing_address?.last_name || ''}`.trim(),
      street: [order.billing_address?.street_1, order.billing_address?.street_2].filter(Boolean).join(', '),
      city: order.billing_address?.city || '',
      state: order.billing_address?.state || '',
      zip: order.billing_address?.zip || '',
      country: order.billing_address?.country || 'United States'
    };

    const shipRes = await fetch(`${BIGCOMMERCE_API_URL}/stores/${storeHash}/v2/orders/${orderId}/shipping_addresses`, {
      headers,
      cache: 'no-store'
    });
    if (shipRes.ok) {
      const shipAddrs = await shipRes.json();
      if (Array.isArray(shipAddrs) && shipAddrs.length > 0) {
        const s = shipAddrs[0];
        shipping = {
          name: `${s.first_name || ''} ${s.last_name || ''}`.trim(),
          street: [s.street_1, s.street_2].filter(Boolean).join(', '),
          city: s.city || '',
          state: s.state || '',
          zip: s.zip || '',
          country: s.country || 'United States'
        };
      }
    }

    const billing = {
      name: `${order.billing_address?.first_name || ''} ${order.billing_address?.last_name || ''}`.trim(),
      street: [order.billing_address?.street_1, order.billing_address?.street_2].filter(Boolean).join(', '),
      city: order.billing_address?.city || '',
      state: order.billing_address?.state || '',
      zip: order.billing_address?.zip || '',
      country: order.billing_address?.country || 'United States'
    };

    return {
      orderId,
      customerName: billing.name || shipping.name || 'Valued Customer',
      customerEmail: order.billing_address?.email || '',
      customerPhone: order.billing_address?.phone || '',
      paymentMethod: order.payment_method || 'Standard',
      status: order.status || 'Pending',
      subtotal: Number(order.subtotal_inc_tax || order.subtotal_ex_tax || 0).toFixed(2),
      shippingCost: Number(order.shipping_cost_inc_tax || order.shipping_cost_ex_tax || 0).toFixed(2),
      total: Number(order.total_inc_tax || order.total_ex_tax || 0).toFixed(2),
      items,
      shippingAddress: shipping,
      billingAddress: billing,
      orderComments: order.customer_message || ''
    };
  } catch (err) {
    console.error('Error fetching order details from BigCommerce for email:', err);
    return null;
  }
}

/**
 * Builds HTML table for order line items.
 */
function renderItemsHtml(items: OrderEmailItem[]): string {
  if (!items || items.length === 0) {
    return '<tr><td colspan="4" style="padding:12px;text-align:center;color:#666;">Order items registered</td></tr>';
  }

  return items
    .map(
      (item) => `
    <tr style="border-bottom:1px solid #eee;">
      <td style="padding:12px 8px;font-size:14px;color:#111;">
        <strong>${item.name}</strong>
        ${item.sku ? `<br><span style="font-size:11px;color:#888;">SKU: ${item.sku}</span>` : ''}
      </td>
      <td style="padding:12px 8px;font-size:14px;color:#444;text-align:center;">${item.quantity}</td>
      <td style="padding:12px 8px;font-size:14px;color:#444;text-align:right;">$${item.price}</td>
      <td style="padding:12px 8px;font-size:14px;color:#111;font-weight:bold;text-align:right;">$${item.total}</td>
    </tr>
  `
    )
    .join('');
}

/**
 * Sends confirmation emails to both the client and store admin via Resend.
 */
export async function sendOrderConfirmationEmails(
  orderId: number,
  fallbackData?: Partial<OrderEmailDetails>
): Promise<{ success: boolean; clientEmailSent: boolean; adminEmailSent: boolean; error?: string }> {
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY is missing. Skipping email notifications.');
    return { success: false, clientEmailSent: false, adminEmailSent: false, error: 'RESEND_API_KEY not configured' };
  }

  const resend = new Resend(resendApiKey);

  // Fetch full details from BigCommerce
  const bcDetails = await fetchOrderDetailsFromBigCommerce(orderId);
  const details: OrderEmailDetails = {
    orderId,
    customerName: bcDetails?.customerName || fallbackData?.customerName || 'Customer',
    customerEmail: bcDetails?.customerEmail || fallbackData?.customerEmail || '',
    customerPhone: bcDetails?.customerPhone || fallbackData?.customerPhone || '',
    paymentMethod: bcDetails?.paymentMethod || fallbackData?.paymentMethod || 'Selected Payment Method',
    status: bcDetails?.status || fallbackData?.status || 'Awaiting Payment',
    subtotal: bcDetails?.subtotal || fallbackData?.subtotal || '0.00',
    shippingCost: bcDetails?.shippingCost || fallbackData?.shippingCost || '0.00',
    total: bcDetails?.total || fallbackData?.total || '0.00',
    items: bcDetails?.items?.length ? bcDetails.items : fallbackData?.items || [],
    shippingAddress: bcDetails?.shippingAddress || fallbackData?.shippingAddress || {
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    billingAddress: bcDetails?.billingAddress || fallbackData?.billingAddress || {
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    orderComments: bcDetails?.orderComments || fallbackData?.orderComments || ''
  };

  const itemsHtml = renderItemsHtml(details.items);

  // --- 1. Client Confirmation Email Template ---
  const clientHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Order Confirmation #${details.orderId}</title>
  </head>
  <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;margin:0;padding:24px;background-color:#f8f8f8;color:#222;">
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #eaeaea;">
      
      <!-- Header -->
      <div style="background-color:#181412;padding:28px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:2px;text-transform:uppercase;">Perfume Store Atlanta</h1>
        <p style="color:#c8aa77;margin:6px 0 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Order Confirmation</p>
      </div>

      <!-- Hero Message -->
      <div style="padding:28px 24px 20px;">
        <h2 style="font-size:18px;color:#111;margin-top:0;">Thank you for your order, ${details.customerName}!</h2>
        <p style="font-size:14px;line-height:1.6;color:#555;">
          We have received your order <strong>#${details.orderId}</strong> and it is being processed. Below is a summary of your purchase.
        </p>

        <!-- Order Summary Box -->
        <div style="background:#faf8f5;border:1px solid #ebdcc5;border-radius:8px;padding:16px;margin:20px 0;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
            <span><strong>Order Number:</strong> #${details.orderId}</span>
          </div>
          <div style="font-size:13px;color:#555;margin-bottom:4px;">
            <strong>Payment Method:</strong> ${details.paymentMethod}
          </div>
          <div style="font-size:13px;color:#555;">
            <strong>Order Status:</strong> ${details.status}
          </div>
        </div>

        <!-- Items Table -->
        <h3 style="font-size:15px;text-transform:uppercase;letter-spacing:1px;margin:24px 0 12px;color:#111;">Items in your order</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:#f4f4f4;border-bottom:2px solid #ddd;font-size:12px;text-transform:uppercase;color:#555;">
              <th style="padding:10px 8px;text-align:left;">Item</th>
              <th style="padding:10px 8px;text-align:center;">Qty</th>
              <th style="padding:10px 8px;text-align:right;">Price</th>
              <th style="padding:10px 8px;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Totals Row -->
        <div style="margin-left:auto;width:240px;margin-bottom:28px;">
          <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;color:#666;">
            <span>Subtotal:</span>
            <span>$${details.subtotal}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;color:#666;">
            <span>Shipping:</span>
            <span>$${details.shippingCost}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:16px;font-weight:bold;color:#111;border-top:1px solid #ddd;">
            <span>Total:</span>
            <span>$${details.total}</span>
          </div>
        </div>

        <!-- Address Columns -->
        <table style="width:100%;margin-bottom:20px;">
          <tr>
            <td style="vertical-align:top;width:50%;padding-right:12px;">
              <h4 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#888;margin:0 0 8px;">Shipping Address</h4>
              <p style="font-size:13px;line-height:1.5;margin:0;color:#333;">
                ${details.shippingAddress.name}<br>
                ${details.shippingAddress.street}<br>
                ${details.shippingAddress.city}, ${details.shippingAddress.state} ${details.shippingAddress.zip}<br>
                ${details.shippingAddress.country}
              </p>
            </td>
            <td style="vertical-align:top;width:50%;padding-left:12px;">
              <h4 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#888;margin:0 0 8px;">Billing Address</h4>
              <p style="font-size:13px;line-height:1.5;margin:0;color:#333;">
                ${details.billingAddress.name}<br>
                ${details.billingAddress.street}<br>
                ${details.billingAddress.city}, ${details.billingAddress.state} ${details.billingAddress.zip}<br>
                ${details.billingAddress.country}
              </p>
            </td>
          </tr>
        </table>

        ${
          details.orderComments
            ? `
          <div style="background:#f9f9f9;padding:12px 16px;border-radius:6px;font-size:13px;margin-bottom:20px;">
            <strong>Order Notes:</strong> ${details.orderComments}
          </div>
        `
            : ''
        }
      </div>

      <!-- Footer -->
      <div style="background:#f4f4f4;padding:16px 24px;text-align:center;font-size:12px;color:#777;border-top:1px solid #eaeaea;">
        <p style="margin:0 0 6px;">Questions regarding your order? Reply directly to this email or contact us at <a href="mailto:ar@perfumestoreatlanta.com" style="color:#b42e31;text-decoration:none;">ar@perfumestoreatlanta.com</a>.</p>
        <p style="margin:0;color:#999;">&copy; ${new Date().getFullYear()} Perfume Store Atlanta. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  // --- 2. Admin Notification Email Template ---
  const adminHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>New Order #${details.orderId}</title>
  </head>
  <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;margin:0;padding:24px;background-color:#f2f4f6;color:#222;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #dcdfe4;">
      
      <!-- Admin Header -->
      <div style="background-color:#b42e31;padding:24px;text-align:center;color:#ffffff;">
        <h1 style="margin:0;font-size:20px;letter-spacing:1px;text-transform:uppercase;">New Order Placed: #${details.orderId}</h1>
        <p style="margin:4px 0 0;font-size:13px;opacity:0.9;">Total: $${details.total} | ${details.paymentMethod}</p>
      </div>

      <div style="padding:24px;">
        <div style="background:#f8f9fa;border-left:4px solid #b42e31;padding:14px 18px;margin-bottom:20px;">
          <p style="margin:0 0 6px;font-size:14px;"><strong>Customer:</strong> ${details.customerName} (${details.customerEmail})</p>
          ${details.customerPhone ? `<p style="margin:0 0 6px;font-size:14px;"><strong>Phone:</strong> ${details.customerPhone}</p>` : ''}
          <p style="margin:0 0 6px;font-size:14px;"><strong>Payment Gateway:</strong> ${details.paymentMethod}</p>
          <p style="margin:0;font-size:14px;"><strong>Status:</strong> ${details.status}</p>
        </div>

        <h3 style="font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:20px 0 10px;color:#333;">Order Items</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <thead>
            <tr style="background:#f0f2f5;font-size:12px;text-transform:uppercase;color:#444;">
              <th style="padding:8px;text-align:left;">Item</th>
              <th style="padding:8px;text-align:center;">Qty</th>
              <th style="padding:8px;text-align:right;">Price</th>
              <th style="padding:8px;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-left:auto;width:240px;margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;color:#666;">
            <span>Subtotal:</span>
            <span>$${details.subtotal}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;color:#666;">
            <span>Shipping:</span>
            <span>$${details.shippingCost}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:16px;font-weight:bold;color:#111;border-top:1px solid #ddd;">
            <span>Grand Total:</span>
            <span>$${details.total}</span>
          </div>
        </div>

        <table style="width:100%;margin-bottom:20px;">
          <tr>
            <td style="vertical-align:top;width:50%;padding-right:12px;">
              <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#666;margin:0 0 6px;">Shipping Destination</h4>
              <p style="font-size:13px;line-height:1.4;margin:0;color:#333;">
                ${details.shippingAddress.name}<br>
                ${details.shippingAddress.street}<br>
                ${details.shippingAddress.city}, ${details.shippingAddress.state} ${details.shippingAddress.zip}<br>
                ${details.shippingAddress.country}
              </p>
            </td>
            <td style="vertical-align:top;width:50%;padding-left:12px;">
              <h4 style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#666;margin:0 0 6px;">Billing Details</h4>
              <p style="font-size:13px;line-height:1.4;margin:0;color:#333;">
                ${details.billingAddress.name}<br>
                ${details.billingAddress.street}<br>
                ${details.billingAddress.city}, ${details.billingAddress.state} ${details.billingAddress.zip}<br>
                ${details.billingAddress.country}
              </p>
            </td>
          </tr>
        </table>

        ${
          details.orderComments
            ? `
          <div style="background:#fff4e5;border:1px solid #ffe2b3;padding:12px 16px;border-radius:6px;font-size:13px;margin-bottom:20px;">
            <strong>Customer Message / Notes:</strong><br>${details.orderComments}
          </div>
        `
            : ''
        }

        <div style="text-align:center;margin-top:28px;">
          <a href="https://login.bigcommerce.com/deep-links/manage/orders/${details.orderId}" style="background:#181412;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:13px;font-weight:bold;display:inline-block;letter-spacing:0.5px;">
            View Order in BigCommerce &rarr;
          </a>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  let clientEmailSent = false;
  let adminEmailSent = false;

  // Send to customer if email is available
  if (details.customerEmail) {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: details.customerEmail,
        replyTo: ADMIN_EMAIL,
        subject: `Order Confirmation #${details.orderId} - Perfume Store Atlanta`,
        html: clientHtml
      });
      clientEmailSent = true;
    } catch (err: any) {
      console.error(`Failed to send customer confirmation email to ${details.customerEmail}:`, err);
    }
  }

  // Send to store admin
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: details.customerEmail || undefined,
      subject: `[New Order #${details.orderId}] from ${details.customerName} ($${details.total})`,
      html: adminHtml
    });
    adminEmailSent = true;
  } catch (err: any) {
    console.error(`Failed to send admin notification email to ${ADMIN_EMAIL}:`, err);
  }

  return {
    success: clientEmailSent || adminEmailSent,
    clientEmailSent,
    adminEmailSent
  };
}
