import { ENGLISH_LANGUAGE, VIETNAMESE_LANGUAGE } from '../helpers/consts';
export enum AppLanguage {
  ENGLISH = 'en',
  VIETNAMESE = 'vi',
}

export type LanguageType = typeof VIETNAMESE_LANGUAGE | typeof ENGLISH_LANGUAGE;