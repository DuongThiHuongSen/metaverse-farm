import i18next from 'i18next';
import en from 'i18n/en.json';
import vi from 'i18n/vi.json';
import { initReactI18next } from "react-i18next";
// import { DEFAULT_LANGUAGE, DEFAULT_NAMESPACE } from "constant";
// import { getOSLanguage } from "utils";

i18next.use(initReactI18next).init(
  {
    interpolation: {
      escapeValue: false,
      prefix: '{',
      suffix: '}',
    },
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: en
      },
      vi: {
        translation: vi
      },
    },
    // defaultNS: '',
    // fallbackNS: '',
    contextSeparator: "__",
  },
  (err: unknown) => {
    if (err) {
      return console.error(err);
    }
  },
);

export default i18next;
