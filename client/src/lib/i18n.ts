import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from '../locales/en/translation.json';
import translationTR from '../locales/tr/translation.json';
import translationDE from '../locales/de/translation.json';

// Çevirileri konumlandır
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
  // Otomatik dil algılama
  .use(LanguageDetector)
  // React-i18next ile entegrasyon
  .use(initReactI18next)
  // i18n'i başlat
  .init({
    resources,
    fallbackLng: 'en', // Varsayılan dil
    debug: false, // Geliştirme modunda hata ayıklama
    detection: {
      order: ['localStorage', 'navigator'], // Önce localStorage'dan, sonra tarayıcı ayarlarından dil algıla
      caches: ['localStorage'] // Dil tercihini localStorage'da sakla
    },
    interpolation: {
      escapeValue: false // XSS saldırılarına karşı React zaten önlem alıyor
    }
  });

export default i18n;