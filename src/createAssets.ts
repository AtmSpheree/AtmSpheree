import { writeFileSync } from "fs"
import makeGradient, { getAlphaColor } from "./utils/animateColorFunctions";
import { data, type ThemeColor } from "./static";

const colorAssets = {
  theme_light_to_dark: Object.fromEntries(Object.entries(data.themes.light.colors).map(([key, value]) => 
    [key, makeGradient(value, data.themes.dark.colors[key as ThemeColor], data.animation.theme.change, data.animation.theme.step)]
  )),
  language_light: Object.fromEntries(Object.entries(
    Object.fromEntries(Object.entries(data.themes.light.colors).filter(
      ([key]) => key.startsWith("--text")
    ))
  ).map(([key, value]) => 
    [key, makeGradient(value, getAlphaColor(data.themes.light.colors[key as ThemeColor]), data.animation.language.change, data.animation.language.step)]
  )),
  language_dark: Object.fromEntries(Object.entries(
    Object.fromEntries(Object.entries(data.themes.dark.colors).filter(
      ([key]) => key.startsWith("--text")
    ))
  ).map(([key, value]) => 
    [key, makeGradient(value, getAlphaColor(data.themes.dark.colors[key as ThemeColor]), data.animation.language.change, data.animation.language.step)]
  ))
};

writeFileSync("src/assets/colorGradients.json", JSON.stringify(colorAssets, null, 4), "utf-8");

console.log("The src/assets/colorGradients.json was successfully recorded.");