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

            // 3. Open Modal
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'I Love Meme Premium',
                description: 'Upgrade to Premium - No Ads & Unlimited Downloads',
                order_id: orderData.id,
                handler: async function (response: any) {
                    // Verify payment here (or assume success for now and verify on backend ideally)
                    // For simplicity in this step, we trust the success callback to update UI, 
                    // BUT crucially we should call backend to update DB securely.
                    // Since we don't have a secure backend verification function set up yet, 
                    // we will rely on client-side update for the DEMO, but warn this is not prod-secure.

                    await DatabaseService.setPremiumStatus(user.id, true);
                    onSuccess();
                },
                prefill: {
                    name: user.user_metadata?.full_name || '',
                    email: user.email || '',
                },
                theme: {
                    color: '#ea580c', // Orange-600
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
