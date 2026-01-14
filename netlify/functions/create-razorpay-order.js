import Razorpay from 'razorpay';

// These should be in process.env
const KEY_ID = 'rzp_test_S3jpsysZ3aqLiQ';
const KEY_SECRET = '7YsdNv7HjVfTp1w76awb6DYL';

const razorpay = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
});

exports.handler = async (event: any) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const amount = 100; // 1 INR in paise (User said "only one rupees")

        const options = {
            amount: amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1, // Auto capture
        };

        const order = await razorpay.orders.create(options);

        return {
            statusCode: 200,
            body: JSON.stringify(order),
        };
    } catch (error) {
        console.error('Razorpay Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create order' }),
        };
    }
};
