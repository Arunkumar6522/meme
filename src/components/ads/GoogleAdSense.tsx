import React, { useEffect, useRef } from 'react';

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
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        // Check if the element is visible and has width before requesting an ad
        // This prevents "No slot size for availableWidth=0" error when ad is in a hidden container (e.g. mobile vs desktop)
        if (adRef.current && adRef.current.offsetWidth > 0) {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
                console.error('AdSense error:', err);
            }
        }
    }, []);

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
