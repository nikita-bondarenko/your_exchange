import { CurrentProjectTheme } from "@/shared/model/theme";
import { LIGHT_THEME } from "./lightTheme";

export const TOP_THEME: CurrentProjectTheme = {
  ...LIGHT_THEME,
  "--main-color": "#F09810",

  "--text-main-screen-title": "#FFFFFF",
  "--text-main-screen-subtitle": "#FFFFFF",

  "--text-button-main": "#FFFFFF",
  "--text-button-secondary": "#FFFFFF",
  "--text-button-first-screen-left": "#FFFFFF",
  "--text-button-first-screen-right": "#323232",

  "--text-main-screen-description": "#FB9325",

  "--background-button-first-screen-left": "#262626",
  "--background-button-first-screen-right": "#F5F5F5",
  "--background-button-secondary": "#262626",
  "--background-first-screen":
    "linear-gradient(149.32deg, #F09810 5.59%, #FF902F 105.56%)",
  "--background-request-status": "#FFEAD3",
  "--background-first-screen-description": "#FFEAD3",
  "--background-button-profile": "#262626",
  "--background-profile-icon": "#E3E3E3",
  "--background-exchange-type-selected": "#FFF8E5",
  "--profile-button-wave": "#d2f0ff",

  "--border-button-secondary": "#262626",
  "--border-profile-icon": "#FFFFFF",
};
