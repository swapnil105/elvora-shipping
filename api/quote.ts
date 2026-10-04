// Production-Ready Serverless API endpoint for ELVORA Shipping Quote / Query requests
// Compatible with Vercel Serverless Functions, Node HTTP, and edge runtimes

interface EmailPayload {
  referenceId: string;
  name: string;
  company: string;
  email: string;
  details: string;
  timestamp: number;
}

const RECIPIENT_EMAIL = process.env.QUOTE_RECIPIENT_EMAIL || 'sales@elvorashipping.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'ELVORA Quotes <quotes@elvorashipping.com>';

async function dispatchEmail(payload: EmailPayload): Promise<{ delivered: boolean; provider: string; error?: string }> {
  // 1. Check for Resend (Preferred for Vercel / modern web)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [RECIPIENT_EMAIL],
          reply_to: payload.email,
          subject: `New Quote Request [${payload.referenceId}] — ${payload.company ? `${payload.company} (${payload.name})` : payload.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #0e4d6e; border-top: 4px solid #0e4d6e; padding: 24px; color: #0f1a24;">
              <h2 style="color: #0e4d6e; margin-top: 0;">ELVORA SHIPPING — New Commercial Quote Request</h2>
              <p style="font-size: 13px; color: #5c6875;">Reference ID: <strong>${payload.referenceId}</strong> · Submitted: ${new Date(payload.timestamp).toUTCString()}</p>
              <hr style="border: none; border-top: 1px solid #dde7ee; margin: 16px 0;" />
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Customer Name:</td><td>${payload.name}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Company:</td><td>${payload.company || 'Not specified'}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold;">Customer Email:</td><td><a href="mailto:${payload.email}">${payload.email}</a></td></tr>
              </table>
              <div style="margin-top: 20px;">
                <h4 style="color: #0e4d6e; margin-bottom: 8px;">Shipment Details & Requirements:</h4>
                <div style="background-color: #eef2f6; padding: 14px; border-left: 3px solid #1f8aa8; font-size: 14px; white-space: pre-wrap; line-height: 1.5;">${payload.details}</div>
              </div>
              <hr style="border: none; border-top: 1px solid #dde7ee; margin: 24px 0 16px 0;" />
              <p style="font-size: 12px; color: #5c6875; margin: 0;">This enquiry was routed through elvorashipping.com. To reply directly to the customer, reply to this email.</p>
            </div>
          `,
          text: `ELVORA SHIPPING — New Quote Request\nReference: ${payload.referenceId}\nName: ${payload.name}\nCompany: ${payload.company || 'N/A'}\nEmail: ${payload.email}\n\nShipment Details:\n${payload.details}\n`,
        }),
      });

      if (res.ok) {
        return { delivered: true, provider: 'resend' };
      }
      const errText = await res.text();
      console.error('[ELVORA API] Resend API error response:', errText);
      return { delivered: false, provider: 'resend', error: 'Resend API rejected request' };
    } catch (e: any) {
      console.error('[ELVORA API] Resend connection exception:', e?.message || e);
      return { delivered: false, provider: 'resend', error: e?.message || 'Connection failure' };
    }
  }

  // 2. Check for SendGrid
  if (process.env.SENDGRID_API_KEY) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: RECIPIENT_EMAIL }] }],
          from: { email: process.env.SENDGRID_FROM_EMAIL || 'quotes@elvorashipping.com', name: 'ELVORA Quotes' },
          reply_to: { email: payload.email, name: payload.name },
          subject: `New Quote Request [${payload.referenceId}] — ${payload.company ? `${payload.company} (${payload.name})` : payload.name}`,
          content: [
            {
              type: 'text/html',
              value: `<p>New quote request from ${payload.name} (${payload.company || 'N/A'}).</p><p>Email: ${payload.email}</p><p>Details: ${payload.details}</p>`,
            },
          ],
        }),
      });

      if (res.ok || res.status === 202) {
        return { delivered: true, provider: 'sendgrid' };
      }
      const errText = await res.text();
      console.error('[ELVORA API] SendGrid API error response:', errText);
      return { delivered: false, provider: 'sendgrid', error: 'SendGrid rejected request' };
    } catch (e: any) {
      console.error('[ELVORA API] SendGrid connection exception:', e?.message || e);
      return { delivered: false, provider: 'sendgrid', error: e?.message || 'Connection failure' };
    }
  }

  // 3. Check for Webhook (Slack / CRM / Zapier)
  if (process.env.QUOTE_WEBHOOK_URL) {
    try {
      const res = await fetch(process.env.QUOTE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return { delivered: true, provider: 'webhook' };
      }
      return { delivered: false, provider: 'webhook', error: 'Webhook rejected request' };
    } catch (e: any) {
      return { delivered: false, provider: 'webhook', error: e?.message };
    }
  }

  // 4. Simulated mode (ONLY for local integration testing when explicitly enabled)
  if (process.env.QUOTE_SIMULATE_DELIVERY === 'true') {
    console.log(`[ELVORA API] QUOTE_SIMULATE_DELIVERY is true: Simulating delivery for ref ${payload.referenceId}`);
    return { delivered: true, provider: 'simulated' };
  }

  // No email service configured
  return { delivered: false, provider: 'none', error: 'NO_EMAIL_PROVIDER_CONFIGURED' };
}

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ success: false, error: 'Method Not Allowed. Please use POST.' }));
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ success: false, message: 'Invalid JSON request payload.' }));
      }
    } else if (!body) {
      body = {};
    }

    const { name, company, email, details, trap, timestamp } = body;

    // Honeypot spam protection: return silent acceptance to automated crawlers
    if (trap) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, delivered: false, message: 'Enquiry received.' }));
    }

    // Bot submission timing check: reject automated bot blasts (< 400ms from form mount)
    if (timestamp && Date.now() - Number(timestamp) < 400) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: true, delivered: false, message: 'Enquiry received.' }));
    }

    // Server-side validation
    const errors: Record<string, string> = {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      errors.name = 'Full name is required.';
    } else if (name.trim().length > 80) {
      errors.name = 'Name must be 80 characters or less.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      errors.email = 'A valid corporate or personal email address is required.';
    } else if (email.trim().length > 120) {
      errors.email = 'Email must be 120 characters or less.';
    }

    if (!details || typeof details !== 'string' || !details.trim()) {
      errors.details = 'Shipment details are required.';
    } else if (details.trim().length < 5) {
      errors.details = 'Please provide details about your cargo, origin, and destination.';
    } else if (details.trim().length > 2000) {
      errors.details = 'Details must be 2000 characters or less.';
    }

    if (Object.keys(errors).length > 0) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ success: false, errors, message: 'Validation failed.' }));
    }

    // Generate reference ID
    const referenceId = `ELV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Execute real transactional email dispatch
    const dispatchResult = await dispatchEmail({
      referenceId,
      name: name.trim(),
      company: (company || '').trim(),
      email: email.trim(),
      details: details.trim(),
      timestamp: Date.now(),
    });

    if (dispatchResult.delivered) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        success: true,
        delivered: true,
        provider: dispatchResult.provider,
        referenceId,
        recipient: RECIPIENT_EMAIL,
        message: `Your quote request has been verified and delivered to our commercial desk in Dubai (${RECIPIENT_EMAIL}).`,
      }));
    }

    // If delivery could not occur (e.g. no provider configured, or provider rejected)
    console.warn(`[ELVORA API] Quote validated (${referenceId}) but email delivery unfulfilled: ${dispatchResult.error}`);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      success: true,
      delivered: false,
      deliveryStatus: dispatchResult.error === 'NO_EMAIL_PROVIDER_CONFIGURED' ? 'UNCONFIGURED' : 'FAILED',
      referenceId,
      recipient: RECIPIENT_EMAIL,
      message: dispatchResult.error === 'NO_EMAIL_PROVIDER_CONFIGURED'
        ? `The deployment environment does not yet have transactional email credentials (RESEND_API_KEY) configured. Please send your enquiry directly to ${RECIPIENT_EMAIL}.`
        : `Could not dispatch to sales inbox automatically. Please send directly to ${RECIPIENT_EMAIL}.`,
      requiredEnv: ['RESEND_API_KEY', 'QUOTE_RECIPIENT_EMAIL (optional, defaults to sales@elvorashipping.com)'],
    }));
  } catch (error) {
    console.error('[ELVORA API] Unhandled server error in quote handler:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      success: false,
      delivered: false,
      message: 'Internal server error processing enquiry. Please contact sales@elvorashipping.com directly.',
    }));
  }
}
