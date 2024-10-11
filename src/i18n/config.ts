import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslationJson from "./locales/en/translation.json";
import frTranslationJson from "./locales/fr/translation.json";
import deTranslationJson from "./locales/de/translation.json";
import itTranslationJson from "./locales/it/translation.json";
import esTranslationJson from "./locales/es/translation.json";
import jaTranslationJson from "./locales/ja/translation.json";
import koTranslationJson from "./locales/ko/translation.json";

const resources = {
  en: {
    translation: enTranslationJson,
  },
  fr: {
    translation: frTranslationJson,
  },
  de: {
    translation: deTranslationJson,
  },
  it: {
    translation: itTranslationJson,
  },
  es: {
    translation: esTranslationJson,
  },
  ja: {
    translation: jaTranslationJson,
  },
  ko: {
    translation: koTranslationJson,
  },
};

export const initI18next = async () => {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["navigator"],
      },
    });
};
