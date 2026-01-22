import mixpanel from 'mixpanel-browser'

/**
 * Mixpanel Analytics Utility
 * 
 * Provides helper functions for tracking events and user identification
 */

export const analytics = {
    /**
     * Track a custom event
     * @param eventName - Name of the event to track
     * @param properties - Optional properties to attach to the event
     */
    track: (eventName: string, properties?: Record<string, any>) => {
        mixpanel.track(eventName, properties)
    },

    /**
     * Identify a user
     * @param userId - Unique user identifier
     */
    identify: (userId: string) => {
        mixpanel.identify(userId)
    },

    /**
     * Set user properties
     * @param properties - User properties to set
     */
    setUserProperties: (properties: Record<string, any>) => {
        mixpanel.people.set(properties)
    },

    /**
     * Track page view (if not using autocapture)
     * @param pageName - Name of the page
     */
    trackPageView: (pageName: string) => {
        mixpanel.track_pageview({ page: pageName })
    },

    /**
     * Reset user identity (on logout)
     */
    reset: () => {
        mixpanel.reset()
    },
}

export default analytics
