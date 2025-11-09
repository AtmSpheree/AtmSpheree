import { create } from "zustand";
import { data, themes, type ColorGradients, type ThemeColor, type ThemeColorsValues, type ThemeName } from "../static";
import colorGradients from '../assets/colorGradients.json';
import { sleep } from "../utils/sleep";
import useLanguageStore from "./useLanguageStore";

interface ThemeStore {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
  isThemeInitialized: boolean;
  isAnimating: boolean;
}

const root: HTMLElement = document.documentElement;

const getSystemTheme = (): ThemeName => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

function getDefaultTheme(): ThemeName {
  const stored = localStorage.getItem("theme") as ThemeName | null;
  if (stored && (stored === "light" || stored === "dark")) {
    return stored;
  }
  return getSystemTheme();
}

const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: getDefaultTheme(),
  setTheme: async (theme: ThemeName): Promise<void> => {
    if (get().theme === theme && get().isThemeInitialized) {
      return;
    }

    set({ theme: theme });

    if (get().isAnimating || useLanguageStore.getState().isAnimating) {
      return;
    }

    const colors: ThemeColorsValues = data.themes[theme].colors;
  
    for (const [key, value] of Object.entries(data.themes[theme].properties)) {
      root.style.setProperty(key, value);
    }
    if (!get().isThemeInitialized) {
      for (const [key, value] of Object.entries(colors)) {
        root.style.setProperty(key, value);
      }
      set({ isThemeInitialized: true });
    }
    else {
      set({ isAnimating: true });

      let color_assets: ColorGradients = colorGradients.theme_light_to_dark;
      let values_count: number = Math.floor(data.animation.theme.change / data.animation.theme.step);
      let iterations: number = theme === "dark" ? 0 : -1;
      let main_order: boolean = theme === "dark";
      do {
        for (const [key] of Object.entries(colors)) {
          root.style.setProperty(key, color_assets[key as ThemeColor].at(iterations) as string);
        }
        if (get().theme === "dark") {
          iterations += 1;
          if (iterations == values_count || (!main_order && iterations === 0)) {
            break;
          }
        } else {
          iterations -= 1;
          if (Math.abs(iterations) > values_count || (main_order && iterations === -1)) {
            break;
          }
        }
        await sleep(10);
      } while (true)
      set({ isAnimating: false });
      for (const [key, value] of Object.entries(data.themes[get().theme].properties)) {
        root.style.setProperty(key, value);
      }
    }
    localStorage.setItem("theme", get().theme);
  },
  toggleTheme: (): void => {
    get().setTheme(themes[themes.indexOf(get().theme) + 1 === themes.length ? 0 : themes.indexOf(get().theme) + 1])
  },
  isThemeInitialized: false,
  isAnimating: false
}));

export default useThemeStore;