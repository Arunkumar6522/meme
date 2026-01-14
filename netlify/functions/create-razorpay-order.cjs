const https = require('https');

// Keys should be set in Netlify Environment Variables
const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (!KEY_ID || !KEY_SECRET) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Missing Razorpay Keys' }),
        };
    }

    // Manual HTTP Request to bypass any SDK weirdness
    // API: https://razorpay.com/docs/api/orders/#create-an-order

    const postData = JSON.stringify({
        amount: 100, // 1 INR
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1
    });

    return new Promise((resolve, reject) => {
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
                // If success or even application error, return it
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
