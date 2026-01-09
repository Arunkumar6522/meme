// Safe configuration management
// This file handles environment variables safely and provides defaults

interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  googleAds?: {
    clientId: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
  };
  features: {
    enableGoogleAds: boolean;
    enableAnalytics: boolean;
    enableUploads: boolean;
  };
}

// Validate required environment variables
const validateEnvVar = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

// Get environment variable with optional default
const getEnvVar = (key: string, defaultValue?: string): string | undefined => {
  return import.meta.env[key] || defaultValue;
};

// Create configuration object
export const config: AppConfig = {
  supabase: {
    url: validateEnvVar('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
    anonKey: validateEnvVar('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
  },
  googleAds: import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID ? {
    clientId: import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID,
  } : undefined,
  app: {
    name: getEnvVar('VITE_APP_NAME', 'Meme Library') || 'Meme Library',
    version: getEnvVar('VITE_APP_VERSION', '1.0.0') || '1.0.0',
    environment: (getEnvVar('NODE_ENV', 'development') as any) || 'development',
  },
  features: {
    enableGoogleAds: !!import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID,
    enableAnalytics: getEnvVar('VITE_ENABLE_ANALYTICS', 'false') === 'true',
    enableUploads: getEnvVar('VITE_ENABLE_UPLOADS', 'true') === 'true',
  },
};

// Export individual config sections for convenience
export const supabaseConfig = config.supabase;
export const googleAdsConfig = config.googleAds;
export const appConfig = config.app;
export const featureFlags = config.features;

// Development helpers
export const isDevelopment = config.app.environment === 'development';
export const isProduction = config.app.environment === 'production';

// Validation function to check if all required configs are present
export const validateConfig = (): boolean => {
  try {
    // Check required Supabase config
    if (!config.supabase.url || !config.supabase.anonKey) {
      console.error('Missing Supabase configuration');
      return false;
    }

    // Validate URL format
    try {
      new URL(config.supabase.url);
    } catch {
      console.error('Invalid Supabase URL format');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Configuration validation failed:', error);
    return false;
  }
};

// Log configuration status (without sensitive data)
if (isDevelopment) {
  console.log('App Configuration:', {
    app: config.app,
    features: config.features,
    supabaseConfigured: !!config.supabase.url,
    googleAdsConfigured: !!config.googleAds?.clientId,
  });
}