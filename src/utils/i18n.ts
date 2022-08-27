import { DEFAULT_LANGUAGE } from 'helpers/consts';
import en from 'i18n/en.json';
import vi from 'i18n/vi.json';
import i18next from 'i18next';
import { initReactI18next } from "react-i18next";
import { getOSLanguage } from "utils";

i18next.use(initReactI18next).init(
  {
    interpolation: {
      escapeValue: false,
      prefix: '{',
      suffix: '}',
    },
    lng: getOSLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    resources: {
      en: {
        translation: en
      },
      vi: {
        translation: vi
      },
    },
    contextSeparator: "__",
  },
  (err: unknown) => {
    if (err) {
      return console.error(err);
    }
  },
);

export default i18next;
