const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// SET THIS TO FALSE WHEN YOU HAVE VALID RAZORPAY KEYS
const USE_MOCK_MODE = true;

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // MOCK MODE: Bypass Razorpay for testing
    if (USE_MOCK_MODE) {
        console.log('⚠️ MOCK MODE ENABLED - No real payment processing');
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                id: `order_mock_${Date.now()}`,
                entity: 'order',
                amount: 100,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                status: 'created',
                key: 'rzp_test_MOCK_KEY_FOR_TESTING',
                mock: true
            })
        };
    }

    // REAL MODE: Use actual Razorpay API
    if (!KEY_ID || !KEY_SECRET) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Missing Razorpay Keys' }),
        };
    }

    const https = require('https');
    const postData = JSON.stringify({
        amount: 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1
    });

    return new Promise((resolve) => {
        const req = https.request({
            hostname: 'api.razorpay.com',
            port: 443,
            path: '/v1/orders',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
                'Authorization': `Basic ${Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64')}`
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode === 201 || res.statusCode === 200 ? 200 : 500,
                    headers,
                    body: JSON.stringify(res.statusCode === 200 || res.statusCode === 201 ? { ...JSON.parse(data), key: KEY_ID } : { error: 'Razorpay API Error', details: JSON.parse(data) })
                });
            });
        });

        req.on('error', (e) => {
            resolve({
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Network Error', details: e.message })
            });
        });

        req.write(postData);
        req.end();
    });
};
