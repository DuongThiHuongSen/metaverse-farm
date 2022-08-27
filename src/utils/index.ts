import { clientStorage } from "utils/storage";
import base58 from "bs58";
import { AppearanceType } from "types/AppearanceType";
import { LanguageType } from "types/AppLanguage";
import { DARK_THEME_MEDIA_SYSTEM, DEFAULT_LANGUAGE } from "helpers/consts";

export const getTheme = (
  key: string,
  fallback: AppearanceType,
): AppearanceType => {
  if (typeof window === "undefined") return fallback;
  try {
    const theme =
      (clientStorage.get(key) as AppearanceType) || getThemeSystem();
    return theme || fallback;
  } catch (error) {
    // Unsupported
    console.error(error);
  }
  return fallback;
};

export const getThemeSystem = (e?: MediaQueryList): AppearanceType => {
  if (!e) {
    e = window.matchMedia(DARK_THEME_MEDIA_SYSTEM);
  }

  const isDark = e.matches;

  const themeSystem = isDark ? AppearanceType.Dark : AppearanceType.Light;
  return themeSystem;
};

export const getOSLanguage = () => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE as LanguageType;

  const language =
    window.navigator.language || Intl.DateTimeFormat().resolvedOptions().locale;

  return (language ? language.slice(0, 2) : DEFAULT_LANGUAGE) as LanguageType;
};

export const parseJSON = (data: string, defaultData: unknown): unknown => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    return defaultData;
  }
};

export const getSignMessage = async (text: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sol = (window as any)?.solana;
  if (!sol) return null;
  try {
    const encodedMessage = new TextEncoder().encode(text);
    const signedMessage = await sol.signMessage(encodedMessage, "utf8");
    return base58.encode(signedMessage.signature) as string;
  } catch (error) {
    console.error(error);
    return null;
  }
};
