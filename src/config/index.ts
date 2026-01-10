// Safe configuration management
// This file handles environment variables safely and provides defaults

interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  smtp?: {
    host: string;
    port: number;
    user: string;
    password: string;
    fromEmail: string;
    fromName: string;
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

// Get environment variable safely (returns placeholder if missing in dev)
const getEnvVarSafe = (key: string, defaultValue: string = ''): string => {
  const value = import.meta.env[key];
  if (!value && import.meta.env.MODE === 'development') {
    console.warn(`⚠️ Missing environment variable: ${key}. Using placeholder value.`);
    return defaultValue;
  }
  return value || defaultValue;
};

// Create configuration object
export const config: AppConfig = {
  supabase: {
    url: getEnvVarSafe('VITE_SUPABASE_URL', 'https://placeholder.supabase.co'),
    anonKey: getEnvVarSafe('VITE_SUPABASE_ANON_KEY', 'placeholder-anon-key'),
  },
  smtp: import.meta.env.VITE_SMTP_HOST ? {
    host: import.meta.env.VITE_SMTP_HOST,
    port: parseInt(import.meta.env.VITE_SMTP_PORT || '587'),
    user: import.meta.env.VITE_SMTP_USER,
    password: import.meta.env.VITE_SMTP_PASSWORD,
    fromEmail: import.meta.env.VITE_SMTP_FROM_EMAIL,
    fromName: import.meta.env.VITE_SMTP_FROM_NAME || 'Meme Library',
  } : undefined,
  googleAds: import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID ? {
    clientId: import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID,
  } : undefined,
  app: {
    name: getEnvVar('VITE_APP_NAME', 'Meme Library') || 'Meme Library',
    version: getEnvVar('VITE_APP_VERSION', '1.1.0') || '1.1.0',
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
export const smtpConfig = config.smtp;
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
    supabaseUrl: config.supabase.url?.substring(0, 30) + '...',
    smtpConfigured: !!config.smtp?.host,
    googleAdsConfigured: !!config.googleAds?.clientId,
  });
  console.log('Environment variables check:', {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
  });
}