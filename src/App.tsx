import React, { useEffect } from 'react';
import AppProviders from '@/app/providers/AppProviders';
import AppRoutes from '@/app/routes/AppRoutes';
import { DatabaseService } from '@/services/database.service';
import { validateConfig, isDevelopment } from '@/config';
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

        // Initialize database (serverless approach)
        if (isDevelopment) {
          console.log('Initializing database...');
        }
        
        const dbInitialized = await DatabaseService.initializeDatabase();
        
        if (!dbInitialized) {
          console.warn('Database initialization failed. Some features may not work properly.');
        }

        // Create helper functions
        await DatabaseService.createHelperFunctions();

        if (isDevelopment) {
          console.log('Application initialized successfully');
        }
      } catch (error) {
        console.error('Application initialization failed:', error);
      }
    };

    initializeApp();
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