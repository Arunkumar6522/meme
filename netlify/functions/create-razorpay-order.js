const Razorpay = require('razorpay');

// These should be in process.env
const KEY_ID = 'rzp_test_S3jpsysZ3aqLiQ';
const KEY_SECRET = '7YsdNv7HjVfTp1w76awb6DYL';

const razorpay = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
});

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const amount = 100; // 1 INR in paise

        const options = {
            amount: amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1, // Auto capture
        };

        const order = await razorpay.orders.create(options);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(order),
        };
    } catch (error) {
        console.error('Razorpay Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to create order', details: error.message }),
        };
    }
};
