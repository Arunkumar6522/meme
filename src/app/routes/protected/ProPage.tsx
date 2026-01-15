import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useNavigate } from 'react-router-dom';

const ProPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { handlePayment, loading: processing } = useRazorpay();
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!user) {
            navigate('/auth/login?redirect=/pro');
            return;
        }

        setLoading(true);
        try {
            await handlePayment(() => {
                alert('Upgrade Successful!');
                navigate('/');
            });
        } catch (error) {
            console.error('Upgrade failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Upgrade to <span className="text-orange-600">Pro</span>
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                    Get an ad-free experience and exclusive features.
                </p>
            </div>

            <div className="mt-12 max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
                <div className="px-6 py-8 sm:p-10 sm:pb-6">
                    <div className="flex justify-center">
                        <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-orange-100 text-orange-600">
                            Pro Plan
                        </span>
                    </div>
                    <div className="mt-4 flex justify-center text-6xl font-extrabold text-gray-900">
                        <span className="ml-1 mr-3 text-xl font-medium text-gray-500 self-start mt-2">₹</span>
                        99
                        <span className="ml-1 text-xl font-medium text-gray-500 self-end mb-2">/month</span>
                    </div>
                </div>
                <div className="flex flex-col flex-1 px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6">
                    <ul className="space-y-4">
                        {[
                            'Ad-free experience',
                            'Unlimited Downloads',
                            'Early access to new memes',
                            'Priority support',
                        ].map((feature) => (
                            <li key={feature} className="flex items-start">
                                <div className="flex-shrink-0">
                                    <Check className="h-6 w-6 text-green-500" aria-hidden="true" />
                                </div>
                                <p className="ml-3 text-base text-gray-700">{feature}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8 rounded-md shadow">
                        <Button
                            onClick={handleUpgrade}
                            disabled={loading || processing}
                            className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 md:text-lg"
                        >
                            {loading || processing ? 'Processing...' : 'Upgrade Now'}
                        </Button>
                    </div>
                    <p className="mt-4 text-xs text-center text-gray-500">
                        Secure payment via Razorpay. Cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProPage;
