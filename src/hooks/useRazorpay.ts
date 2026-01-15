import { useState } from 'react';
import { useAuth } from './useAuth';
import { DatabaseService } from '@/services/database.service';

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

export const useRazorpay = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const loadScript = () => {
        return new Promise((resolve) => {
            if (document.getElementById('razorpay-script')) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.id = 'razorpay-script';
            script.src = RAZORPAY_SCRIPT;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (onSuccess: () => void) => {
        if (!user) {
            alert('Please login to upgrade.');
            return;
        }

        setLoading(true);

        try {
            // 1. Load Script
            const res = await loadScript();
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                setLoading(false);
                return;
            }

            // 2. Create Order
            const response = await fetch('https://ilovememe.in/.netlify/functions/create-razorpay-order', {
                method: 'POST',
            });

            const orderData = await response.json();

            if (!response.ok || !orderData.id) {
                console.error('Order creation failed:', orderData);
                // ALERT THE FULL JSON to figure out the 500 cause
                alert(`Payment Error:\n${JSON.stringify(orderData, null, 2)}`);
                setLoading(false);
                return;
            }

            // 3. Open Modal (or handle Mock Mode)
            if (orderData.mock) {
                // MOCK MODE: Simulate instant payment success
                alert('🎉 TEST MODE: Payment simulation successful!\n\nYou are now a Premium user (for testing).');
                await DatabaseService.setPremiumStatus(user.id, true);
                onSuccess();
                setLoading(false);
                return;
            }

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'I Love Meme Premium',
                description: 'Upgrade to Premium - No Ads & Unlimited Downloads',
                order_id: orderData.id,
                handler: async function (response: any) {
                    await DatabaseService.setPremiumStatus(user.id, true);
                    // Record successful payment (standardized logging)
                    await DatabaseService.recordPayment({
                        userId: user.id,
                        amount: orderData.amount / 100, // Convert paise to whole currency
                        currency: orderData.currency,
                        orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        status: 'captured'
                    });
                    onSuccess();
                },
                prefill: {
                    name: user.user_metadata?.full_name || '',
                    email: user.email || '',
                },
                theme: {
                    color: '#ea580c',
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            alert('Payment failed to initialize.');
        } finally {
            setLoading(false);
        }
    };

    return { handlePayment, loading };
};
