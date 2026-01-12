import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from './useAuth';

const LANG_STORAGE_KEY = 'preferred_languages';

export const ALL_LANGUAGES = ['English', 'Tamil', 'Malayalam', 'Kannada', 'Hindi', 'Telugu'] as const;
export type Language = (typeof ALL_LANGUAGES)[number];

interface LanguageContextValue {
  selectedLanguages: string[];
  setSelectedLanguages: (langs: string[]) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function safeParseLanguages(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const cleaned = parsed.map((x) => String(x)).filter(Boolean);
    return cleaned.length ? cleaned : null;
  } catch {
    return null;
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedLanguages, setSelectedLanguagesState] = useState<string[]>(() => {
    const fromStorage = safeParseLanguages(localStorage.getItem(LANG_STORAGE_KEY));
    return fromStorage || ['English', 'Tamil'];
  });

  const setSelectedLanguages = (langs: string[]) => {
    const cleaned = Array.from(new Set(langs.map((l) => String(l)).filter(Boolean)));
    setSelectedLanguagesState(cleaned.length ? cleaned : ['English']);
  };

  // Load preferred languages from DB on login (DB wins if present)
  useEffect(() => {
    const run = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('users')
        .select('preferred_languages')
        .eq('id', user.id)
        .maybeSingle();
      if (error) return;
      const dbLangs = (data as any)?.preferred_languages as string[] | null | undefined;
      if (Array.isArray(dbLangs) && dbLangs.length) {
        setSelectedLanguagesState(Array.from(new Set(dbLangs.map(String))));
      }
    };
    run();
  }, [user?.id]);

  // Persist to localStorage immediately
  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, JSON.stringify(selectedLanguages));
    } catch {
      // ignore
    }
  }, [selectedLanguages]);

  // Persist to DB (debounced) when logged in
  const saveTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!user?.id) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      supabase
        .from('users')
        .update({ preferred_languages: selectedLanguages })
        .eq('id', user.id)
        .then(() => {
          // ignore
        })
        .catch(() => {
          // ignore
        });
    }, 400);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [selectedLanguages, user?.id]);

  const value = useMemo(
    () => ({ selectedLanguages, setSelectedLanguages }),
    [selectedLanguages]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};

