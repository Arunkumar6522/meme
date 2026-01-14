import React from 'react';
import { config, validateConfig, enableDebugLogs } from '@/config';

const AppDebug: React.FC = () => {
  if (!enableDebugLogs) return null;

  const configValid = validateConfig();

  return (
    <div className="fixed top-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4 max-w-md z-50">
      <h3 className="font-bold">Debug Info</h3>
      <div className="text-sm space-y-1">
        <p><strong>Config Valid:</strong> {configValid ? '✅' : '❌'}</p>
        <p><strong>Environment:</strong> {config.app.environment}</p>
        <p><strong>Supabase URL:</strong> {config.supabase.url ? '✅' : '❌'}</p>
        <p><strong>Supabase Key:</strong> {config.supabase.anonKey ? '✅' : '❌'}</p>
        <p><strong>Google SSO:</strong> {config.oauth.google.enabled ? '✅' : '❌'}</p>
        {!configValid && (
          <p className="text-red-600 font-bold">⚠️ Config validation failed!</p>
        )}
      </div>
    </div>
  );
};

export default AppDebug;