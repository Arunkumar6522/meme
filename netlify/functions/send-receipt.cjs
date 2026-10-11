const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Make sure you POST' };
    }

    // Parse Body
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (e) {
        return { statusCode: 400, body: 'Invalid JSON' };
    }

    const { email, name, orderId, amount, paymentId } = body;

    if (!email || !orderId) {
        return { statusCode: 400, body: 'Missing required fields' };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY is missing');
        return { statusCode: 500, body: 'Server configuration error (Email)' };
    }

    try {
        // Call Resend API directly
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'I Love Meme <noreply@ilovememe.in>', // Note: User needs to verify domain in Resend
                to: [email],
                subject: 'Premium Upgrade Receipt - I Love Meme',
                html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ea580c;">Thank You for Upgrading! 🚀</h1>
            <p>Hi ${name || 'Meme Lover'},</p>
            <p>Your payment for <strong>Premium Membership</strong> was successful.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Amount Paid:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${amount}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Payment ID:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${paymentId}</td>
              </tr>
            </table>

            <p>You now have access to:</p>
            <ul>
              <li>✅ Unlimited Downloads</li>
              <li>✅ Ad-Free Experience</li>
              <li>✅ Exclusive Content</li>
            </ul>

            <p style="margin-top: 30px; font-size: 12px; color: #888;">
              If you have any questions, reply to this email.
            </p>
          </div>
        `
            })
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('Resend API Error:', data);
            return { statusCode: 500, body: JSON.stringify(data) };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent', id: data.id })
        };

    } catch (error) {
        console.error('Email function error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
