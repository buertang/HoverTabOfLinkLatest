import { useState, useEffect, useCallback } from 'react';
import { Language, getTranslation, Translations } from '../lib/i18n';

interface I18nHook {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
}

export function useI18n(): I18nHook {
  const [language, setLanguageState] = useState<Language>('zh-CN');
  const [isLoading, setIsLoading] = useState(true);

  // Load language from storage on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const result = await browser.storage.sync.get(['languageSettings']);
        if (result.languageSettings?.language) {
          setLanguageState(result.languageSettings.language);
        }
      } catch (error) {
        console.error('Failed to load language from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  // Set language and save to storage
  const setLanguage = useCallback(async (lang: Language) => {
    try {
      setLanguageState(lang);
      
      // Get current settings and update language
      const result = await browser.storage.sync.get(['languageSettings']);
      const currentSettings = result.languageSettings || {};
      
      await browser.storage.sync.set({
        languageSettings: {
          ...currentSettings,
          language: lang
        }
      });
    } catch (error) {
      console.error('Failed to save language to storage:', error);
    }
  }, []);

  // Get translations for current language
  const t = getTranslation(language);

  return {
    language,
    t,
    setLanguage,
    isLoading
  };
}

// Helper hook for getting specific translation paths
export function useTranslation() {
  const { t, language, setLanguage, isLoading } = useI18n();
  
  return {
    t,
    language,
    setLanguage,
    isLoading
  };
}