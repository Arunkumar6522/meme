import React, { useEffect } from 'react';

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
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <div className={className} style={style}>
            {/* AdSense Script - This is safe to include multiple times as browsers will cache it, 
            but traditionally it's better in head. However, per user request snippet, we include it here 
            or assume it's loaded. To be safe and follow the snippets exactly, we can include it, 
            but for React it's better to verify if it's already there to avoid unnecessary network requests.
            The user snippet explicitly showing the script tag suggests they might want it.
            But the best practice is to have the script in index.html once.
            I will put the script in index.html and ONLY the ins tag here.
        */}
            <ins
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
