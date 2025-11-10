import { create } from "zustand";
import { languages, type ColorGradients, type ThemeColor, type ThemeColorsValues } from "../static";
import { sleep } from "../utils/sleep";
import colorGradients from '../assets/colorGradients.json';
import useThemeStore from "./useThemeStore";
import { data } from "../static";

type Language = typeof languages[number];

export type Locale = Record<string, Record<string, string>>;

interface LanguageStore {
  language: Language;
  locale: Locale | null;
  loadLocale: (lang?: Language) => void;
  setLanguage: (lang: Language) => void;
  getNextLanguage: () => Language;
  toggleLanguage: () => void;
  isAnimating: boolean;
}

const root: HTMLElement = document.documentElement;

function getLanguage(): Language {
  const stored = localStorage.getItem("language") as Language | null;
  if (stored && (languages.includes(stored))) {
    return stored;
  }
  if (languages.includes(navigator.language.split("-")[0])) {
    return navigator.language.split("-")[0] as Language;
  }
  return "en";
}

const useLanguageStore = create<LanguageStore>((set, get) => ({
  language: getLanguage(),
  locale: null,
  loadLocale: async (lang?: Language): Promise<void> => {
    set({ locale: await import(`../locales/${lang ? lang : get().language}.json`) })
  },
  setLanguage: async (lang: Language): Promise<void> => {
    set({ language: lang });

    if (get().isAnimating || useThemeStore.getState().isAnimating) {
      return;
    }
    
    set({ isAnimating: true });
    const colors: ThemeColorsValues = Object.fromEntries(Object.entries(data.themes[useThemeStore.getState().theme].colors).filter(
      ([key]) => key.startsWith("--text") && key !== "--switch-bg-color"
    ));
    let color_assets: ColorGradients = useThemeStore.getState().theme === "dark" ? colorGradients.language_dark : colorGradients.language_light;
    let values_count: number = Math.floor(data.animation.language.change / data.animation.language.step) + 1;
    let iterations: number = 0;
    do {
      for (const [key] of Object.entries(colors)) {
        root.style.setProperty(key, color_assets[key as ThemeColor].at(iterations) as string);
      }
      if (get().language === lang) {
        iterations += 1;
        if (iterations == values_count) {
          break;
        }
      } else {
        iterations -= 1;
        if (iterations === -1) {
          localStorage.setItem('language', lang)
          set({ isAnimating: false });
          return;
        }
      }
      await sleep(data.animation.language.step);
    } while (true)

    get().loadLocale(lang)
    await sleep(data.animation.language.delay ? data.animation.language.delay : 0);

    iterations = -1;
    do {
      for (const [key] of Object.entries(colors)) {
        root.style.setProperty(key, color_assets[key as ThemeColor].at(iterations) as string);
      }
      iterations -= 1;
      if (Math.abs(iterations) > values_count) {
        break;
      }
      await sleep(data.animation.language.step);
    } while (true)

    localStorage.setItem('language', lang)
    set({ isAnimating: false });
  },
  getNextLanguage: (): Language => {
    return languages[languages.indexOf(get().language) + 1 === languages.length ? 0 : languages.indexOf(get().language) + 1];
  },
  toggleLanguage: (): void => {
    get().setLanguage(languages[languages.indexOf(get().language) + 1 === languages.length ? 0 : languages.indexOf(get().language) + 1]);
  },
  isAnimating: false
}));

export default useLanguageStore;