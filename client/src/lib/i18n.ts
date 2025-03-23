import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Dil dosyalarını içe aktar
import translationEN from '../locales/en/translation.json';
import translationTR from '../locales/tr/translation.json';
import translationDE from '../locales/de/translation.json';

// Kaynaklar
const resources = {
  en: {
    translation: translationEN
  },
  tr: {
    translation: translationTR
  },
  de: {
    translation: translationDE
  }
};

i18n
  // Dil algılayıcısını kullan
  .use(LanguageDetector)
  // React i18next eklentisi
  .use(initReactI18next)
  // i18next'i başlat
  .init({
    resources,
    fallbackLng: 'tr', // Varsayılan dil
    debug: true,
    interpolation: {
      escapeValue: false // React zaten XSS'e karşı koruma sağlıyor
    }
  });

export default i18n;