import React, { useEffect } from 'react';
import AppProviders from '@/app/providers/AppProviders';
import AppRoutes from '@/app/routes/AppRoutes';
import DatabaseSetupNotice from '@/components/DatabaseSetupNotice';
import { MonetagPopup } from '@/components/ads/MonetagAds';
import { PushNotificationAd } from '@/components/ads/AdditionalAds';
import { DatabaseService } from '@/services/database.service';
import { validateConfig, enableDebugLogs } from '@/config';
import '@/styles/globals.css';

function App() {
  useEffect(() => {
    // Initialize application
    const initializeApp = async () => {
      try {
        // Validate configuration
        if (!validateConfig()) {
          console.error('Invalid configuration. Please check your environment variables.');
          return;
        }

        // Register service worker for ad networks
        if ('serviceWorker' in navigator && import.meta.env.PROD) {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);
          } catch (error) {
            console.warn('Service Worker registration failed:', error);
          }
        }

        // Check database tables (and show helpful messages if missing)
        await DatabaseService.initializeDatabase();

        if (enableDebugLogs) console.debug('Application initialized successfully');
      } catch (error) {
        console.error('Application initialization failed:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <AppProviders>
      {/* Ad Network Integrations */}
      <MonetagPopup />
      <PushNotificationAd />
      
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>
      
      {/* Database setup notice */}
      <DatabaseSetupNotice />
      
      <div id="main-content">
        <AppRoutes />
      </div>
    </AppProviders>
  );
}

export default App;