import React, {
  createContext,
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { getThemeSystem, getTheme, parseJSON } from "utils";
import { createTheme, ThemeProvider } from "@mui/material";
import { clientStorage } from "utils/storage";
// import { typography, breakpoints } from "public/material";
import colors from "utils/colors";
import { AppearanceType } from "types/AppearanceType";
import { DARK_THEME_MEDIA_SYSTEM, THEME_KEY } from "helpers/consts";
import { breakpoints, typography } from "material";

type AppearanceProviderProps = {
  children: React.ReactNode;
};

export interface AppearanceState {
  updateAppearanceTypeMode?: (mode: AppearanceType) => void;
}

const initialState: AppearanceState = {};

export const AppearanceContext = createContext<AppearanceState>(initialState);

const AppearanceProvider = (props: AppearanceProviderProps) => {
  const { children } = props;

  const [mode, setMode] = useState<AppearanceType>(AppearanceType.Light);

  const onChangeThemeStorage = (newMode: AppearanceType) => {
    setMode(newMode);
    clientStorage.set(THEME_KEY, newMode);
  };

  const appearanceTypeMode = useMemo(() => {
    return {
      appMode: mode,
      updateAppearanceTypeMode: (newMode?: AppearanceType) => {
        newMode =
          newMode ?? mode === AppearanceType.Light
            ? AppearanceType.Dark
            : AppearanceType.Light;
        onChangeThemeStorage(newMode);
      },
    };
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: getPaletteTokens(mode),
        typography,
        breakpoints,
      }),
    [mode],
  );

  const onMediaQuery = useCallback((event?) => {
    const systemTheme = getThemeSystem(event);
    onChangeThemeStorage(systemTheme);
  }, []);

  const mediaListener = useRef(onMediaQuery);
  mediaListener.current = onMediaQuery;

  useEffect(() => {
    const defaultMode = getTheme(THEME_KEY, AppearanceType.Light);
    onChangeThemeStorage(defaultMode);

    const handlerMediaListener = (...args) => mediaListener.current(...args);

    // Always listen to System preference
    const media = window.matchMedia(DARK_THEME_MEDIA_SYSTEM);
    if (!media) return;

    if (media?.addEventListener) {
      media?.addEventListener("change", handlerMediaListener);
      return () => media?.removeEventListener("change", handlerMediaListener);
    } else {
      media.addListener(handlerMediaListener);
      return () => media.removeListener(handlerMediaListener);
    }
  }, []);

  // localStorage event handling
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_KEY) {
        return;
      }
      // If default theme set, use it if localStorage === null (happens on local storage manual deletion)
      const systemTheme: AppearanceType = getThemeSystem();
      const AppearanceTypeValue = parseJSON(
        event.newValue as string,
        systemTheme,
      ) as AppearanceType;

      const theme = Object.values(AppearanceType).includes(AppearanceTypeValue)
        ? AppearanceTypeValue
        : systemTheme;

      onChangeThemeStorage(theme);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AppearanceContext.Provider value={appearanceTypeMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppearanceContext.Provider>
  );
};

export default AppearanceProvider;

const getPaletteTokens = (mode: AppearanceType) => ({
  mode,
  ...colors[mode],
});
