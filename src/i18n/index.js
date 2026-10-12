import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import bn from './locales/bn.json';

export const LANG_STORAGE_KEY = 'admin_lang';
export const SUPPORTED_LANGS = ['en', 'bn'];

export function getStoredLang() {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  return SUPPORTED_LANGS.includes(stored) ? stored : 'en';
}

export function getNumberLocale(lang = i18n.language) {
  return lang?.startsWith('bn') ? 'bn-BD' : 'en-BD';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bn: { translation: bn },
  },
  lng: getStoredLang(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

function applyDocumentLang(lang) {
  if (typeof document === 'undefined') return;
  const resolved = lang?.startsWith('bn') ? 'bn' : 'en';
  document.documentElement.lang = resolved;
}

applyDocumentLang(i18n.language);

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(LANG_STORAGE_KEY, lng);
  applyDocumentLang(lng);
});

export default i18n;
