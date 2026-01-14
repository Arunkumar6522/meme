import React, { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { DatabaseService } from '@/services/database.service';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';

export const PremiumBanner: React.FC = () => {
    const { user } = useAuth();
    const { handlePayment, loading } = useRazorpay();
    const [isPremium, setIsPremium] = useState(false);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        if (!user) return;
        // Check if already premium
        const check = async () => {
            const { data } = await DatabaseService.supabase
                .from('users')
                .select('is_premium')
                .eq('id', user.id)
                .single();
            if (data?.is_premium) setIsPremium(true);
        };
        check();
    }, [user]);

    if (!user || isPremium || hidden) return null;

    return (
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg shadow-lg p-6 mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
                <button onClick={() => setHidden(true)} className="text-white/80 hover:text-white">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-6 w-6 text-yellow-300" />
                        <span className="font-bold text-yellow-300 uppercase tracking-wider text-sm">Limited Time Offer</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
                    <p className="text-orange-50 max-w-xl">
                        Get <strong>Unlimited Downloads</strong>, <strong>Ad-Free Experience</strong>, and support the community.
                        <br />
                        <span className="text-xl font-bold mt-2 block">
                            It was only ₹1 for a limited time!
                        </span>
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <Button
                        onClick={() => handlePayment(() => {
                            setIsPremium(true);
                            alert('Welcome to Premium! Enjoy your ad-free experience.');
                        })}
                        loading={loading}
                        className="bg-white text-orange-600 hover:bg-orange-50 border-transparent px-8 py-3 text-lg h-auto shadow-xl"
                    >
                        Upgrade Now
                    </Button>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12">
                <Sparkles className="h-40 w-40" />
            </div>
        </div>
    );
};
