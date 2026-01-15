import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DatabaseService } from '@/services/database.service';

type AdType = 'horizontal' | 'vertical' | 'square';

interface GoogleAdSenseProps {
    type: AdType;
    className?: string;
    style?: React.CSSProperties;
}

const AD_SLOTS: Record<AdType, string> = {
    horizontal: '2398096803',
    vertical: '2684009592',
    square: '1534579451',
};

const CLIENT_ID = 'ca-pub-9385541671046952';

const GoogleAdSense: React.FC<GoogleAdSenseProps> = ({ type, className, style }) => {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        if (!user) {
            setIsAdmin(false);
            setIsPremium(false);
            return;
        }

        const checkStatus = async () => {
            // Parallel check
            const [adminStatus, userData] = await Promise.all([
                DatabaseService.isUserAdmin(user.id),
                DatabaseService.supabase.from('users').select('is_premium').eq('id', user.id).single()
            ]);

            setIsAdmin(adminStatus);
            setIsPremium(userData.data?.is_premium || false);
        };
        checkStatus();
    }, [user]);

    const adRef = useRef<HTMLModElement>(null);
    const initialized = useRef(false);



    useEffect(() => {
        const element = adRef.current;
        if (!element) return;

        // Reset if type changes (unlikely but safe)
        if (initialized.current) return;

        // Use ResizeObserver to detect when the ad slot actually has size
        // This handles:
        // 1. Initial load (if visible)
        // 2. CSS 'display: none' -> 'block' transitions (e.g. resizing desktop to mobile)
        // 3. Late layout shifts
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentRect.width > 0 && entry.contentRect.height > 0 && !initialized.current) {
                    // Double check visibility
                    const style = window.getComputedStyle(entry.target);
                    if (style.display !== 'none' && style.visibility !== 'hidden') {
                        try {
                            initialized.current = true;
                            // @ts-ignore
                            (window.adsbygoogle = window.adsbygoogle || []).push({});
                            // Once initialized, we don't need to observe anymore
                            observer.disconnect();
                        } catch (err) {
                            console.error('AdSense error:', err);
                            initialized.current = false; // Retry on next resize if failed?
                        }
                    }
                }
            }
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, [type]);

    if (isAdmin || isPremium) return null;

    return (
        <div className={className} style={{ minHeight: '50px', ...style }}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client={CLIENT_ID}
                data-ad-slot={AD_SLOTS[type]}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
};

export default GoogleAdSense;
