import React, { useEffect } from 'react';
import AppProviders from '@/app/providers/AppProviders';
import AppRoutes from '@/app/routes/AppRoutes';
import { validateConfig, isDevelopment } from '@/config';
import '@/styles/globals.css';

function App() {
  useEffect(() => {
    // Validate configuration
    if (!validateConfig()) {
      console.error('Invalid configuration. Please check your environment variables.');
      return;
    }

    if (isDevelopment) {
      console.log('Application initialized successfully');
    }
  }, []);

  return (
    <AppProviders>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>
      
      <div id="main-content">
        <AppRoutes />
      </div>
    </AppProviders>
  );
}

export default App;