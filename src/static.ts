// Static data

export const languages = ["en", "ru"];

export const themes = [
  "light",
  "dark"
];

export const themeColors: string[] = [
  "--bg-color",
  "--language--switch",
  "--text-color",
  "--accent-color",
  "--switch-bg-color"
];

export interface ThemeProperties {
  "color-scheme": "light" | "dark";
}

// Data types

export type ThemeName = typeof themes[number];

export type ThemeColor = typeof themeColors[number];

export type ThemeColorsValues = Record<ThemeColor, string>;

export interface Theme {
  colors: ThemeColorsValues;
  properties: ThemeProperties;
}

export interface AnimationProperties {
  change: number;
  step: number;
  delay: number | null
}

export interface Data {
  themes: Record<ThemeName, Theme>,
  animation: {
    theme: AnimationProperties,
    language: AnimationProperties
  }
}

export type ColorGradients = Record<keyof ThemeColorsValues, string[]>;

export const data: Data = {
  themes: {
    light: {
      colors: {
        "--bg-color": "rgba(255, 255, 255, 1)",
        "--text-color": "rgba(17, 17, 17, 1)",
        "--language--switch": "rgba(17, 17, 17, 1)",
        "--accent-color": "rgba(0, 123, 255, 1)",
        "--switch-bg-color": "rgba(0, 123, 255, 0.5)"
      },
      properties: {
        "color-scheme": "light"
      }
    },
    dark: {
      colors: {
        "--bg-color": "rgba(14, 14, 14, 1)",
        "--text-color": "rgba(245, 245, 245, 1)",
        "--language--switch": "rgba(245, 245, 245, 1)",
        "--accent-color": "rgba(255, 180, 0, 1)",
        "--switch-bg-color": "rgba(255, 179, 0, 0.5)",
      },
      properties: {
        "color-scheme": "dark"
      }
    },
  },
  animation: {
    theme: {
      change: 250,
      step: 10,
      delay: null
    },
    language: {
      change: 150,
      step: 10,
      delay: 100
    }
  }
};

