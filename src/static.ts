import dataJson from "./assets/data.json";

// Static data

export const languages = ["en", "ru"];

export const themes = [
  "light",
  "dark"
];

export const themeColors: string[] = [
  "--bg-color",
  "--text-color",
  "--skill-color",
  "--burger-color",
  "--text-accent-color",
  "--text-muted-color",
  "--text-soft-color",
  "--text-hero-button-color",
  "--language-switch-color",
  "--accent-color",
  "--block-shadow-color",
  "--switch-bg-color",
  "--surface-border-color",
  "--surface-muted-color",
  "--surface-soft-color"
];

export interface ThemeProperties {
  "color-scheme": "light" | "dark";
}

export const themeFilters: string[] = [
  "--icon-filter"
];

// Data types

export type ThemeName = typeof themes[number];

export type ThemeColor = typeof themeColors[number];

export type ThemeFilter = typeof themeFilters[number];

export type ThemeColorsValues = Record<ThemeColor, string>;

export type ThemeFiltersValues = Record<ThemeFilter, string>

export interface Theme {
  colors: ThemeColorsValues;
  properties: ThemeProperties;
  filters: ThemeFiltersValues
}

export interface AnimationProperties {
  change: number;
  step: number;
  delay: number | null
}

export type Icon = Record<string, {"icon": string, "bgColor": string | null}>;

export interface Data {
  themes: Record<ThemeName, Theme>;
  animation: {
    theme: AnimationProperties,
    language: AnimationProperties
  };
  icons: Icon
}

export type ColorGradients = Record<keyof ThemeColorsValues, string[]>;

export const data: Data = dataJson as Data;
