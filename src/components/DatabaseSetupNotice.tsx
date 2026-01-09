import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { Button } from '@/components/ui';

const DatabaseSetupNotice: React.FC = () => {
  const [showNotice, setShowNotice] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkTables = async () => {
      try {
        // Try to access the tables
        const { error: usersError } = await supabase
          .from('users')
          .select('id')
          .limit(1);

        const { error: itemsError } = await supabase
          .from('library_items')
          .select('id')
          .limit(1);

        // If either table doesn't exist, show setup notice
        if (usersError || itemsError) {
          setShowNotice(true);
        }
      } catch (error) {
        setShowNotice(true);
      } finally {
        setChecking(false);
      }
    };

    checkTables();
  }, []);

  if (checking || !showNotice) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              Database Setup Required
            </h3>
            <p className="text-sm text-yellow-700">
              Please set up your database tables to use all features.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
          >
            Open Supabase
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowNotice(false)}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSetupNotice;