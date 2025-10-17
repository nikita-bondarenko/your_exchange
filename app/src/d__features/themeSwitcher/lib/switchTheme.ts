import { CurrentProjectTheme } from "@/shared/model/theme";

export const switchTheme = (theme: CurrentProjectTheme) => {
  Object.entries(theme).forEach(([key, value]) => {
    console.log('switchTheme', key, value)
    document.documentElement.style.setProperty(key, value);
  });
};
