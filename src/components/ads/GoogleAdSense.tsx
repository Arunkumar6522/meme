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

useEffect(() => {
    // Delay initialization slightly to ensure layout is stable/calculated
    const timer = setTimeout(() => {
        const element = adRef.current;
        if (!element) return;

        // Check if element is truly visible in the DOM
        // offsetParent is null if element or any ancestor is display: none
        const isVisible = element.offsetParent !== null;
        // Also check computed style as a backup
        const style = window.getComputedStyle(element);
        const isNotHidden = style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0;
        const hasWidth = element.offsetWidth > 0;

        if (isVisible && isNotHidden && hasWidth) {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
                console.error('AdSense error:', err);
            }
        } else {
            console.debug('AdSense: Skipping ad push for hidden/zero-width slot', { type, isVisible, isNotHidden, width: element.offsetWidth });
        }
    }, 100); // 100ms delay

    return () => clearTimeout(timer);
}, [type]); // Re-run if type changes, though it typically won't

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
