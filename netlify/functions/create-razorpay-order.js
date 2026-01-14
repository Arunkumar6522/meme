import Razorpay from 'razorpay';

// These should be in process.env
const KEY_ID = 'rzp_test_S3jpsysZ3aqLiQ';
const KEY_SECRET = '7YsdNv7HjVfTp1w76awb6DYL';

export const handler = async (event) => {
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
        console.log('Initializing Razorpay with key:', KEY_ID);

        const razorpay = new Razorpay({
            key_id: KEY_ID,
            key_secret: KEY_SECRET,
        });

        const amount = 100; // 1 INR in paise

        const options = {
            amount: amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1, // Auto capture
        };

        console.log('Creating order with options:', options);
        const order = await razorpay.orders.create(options);
        console.log('Order created:', order);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(order),
        };
    } catch (error) {
        console.error('Razorpay Error:', error);

        // Extract error details safely
        const errorDetails = {
            message: error.message || 'Unknown error',
            name: error.name,
            stack: error.stack,
            raw: JSON.stringify(error, Object.getOwnPropertyNames(error))
        };

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to create order',
                details: errorDetails
            }),
        };
    }
};
