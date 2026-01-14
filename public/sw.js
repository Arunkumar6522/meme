// Service Worker for Ad Networks
// This handles background ad operations and push notifications

self.options = {
    "domain": "5gvci.com",
    "zoneId": 10461165
}
self.lary = ""

// Import the ad network service worker
importScripts('https://5gvci.com/act/files/service-worker.min.js?r=sw')

// Additional service worker functionality for your app
self.addEventListener('install', function(event) {
    console.log('Service Worker: Installing...');
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker: Activating...');
    event.waitUntil(self.clients.claim());
});

// Handle fetch events (optional - for caching strategies)
self.addEventListener('fetch', function(event) {
    // Let the ad network service worker handle its requests
    // Add your own caching logic here if needed
});

// Handle push notifications from ad networks
self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        console.log('Push notification received:', data);
        
        // Show notification if needed
        if (data.title && data.body) {
            event.waitUntil(
                self.registration.showNotification(data.title, {
                    body: data.body,
                    icon: data.icon || '/favicon.ico',
                    badge: data.badge || '/favicon.ico',
                    tag: data.tag || 'ad-notification',
                    requireInteraction: false,
                    silent: true
                })
            );
        }
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data?.url || '/')
        );
    }
});