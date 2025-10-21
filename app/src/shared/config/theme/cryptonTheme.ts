import { CurrentProjectTheme } from "@/shared/model/theme";
import { DARK_THEME } from "./darkTheme";

export const CRYPTON_THEME: CurrentProjectTheme = {
        ...DARK_THEME,

   "--main-color": "#BAF015",

  "--text-main-screen-title": "#BAF015",
  "--text-main-screen-subtitle": "#CDCDCD",

  "--text-button-main": "#000000",
  "--text-button-secondary": "#000000",
  "--text-button-first-screen-left": "#000000",
  "--text-button-first-screen-right": "#323232",

  "--background-button-first-screen-left": "#BAF015",
  "--background-button-first-screen-right": "#F5F5F5",
  "--background-button-secondary": "#F5F5F5",
  "--background-first-screen":
    "linear-gradient(149.32deg, #222222 5.59%, #363636 105.56%)",
  "--background-request-status": "#383838",
  "--background-button-profile": "#BAF015",
  "--background-profile-icon": "#282828",

  "--border-profile-icon": "#000000",
  "--profile-button-wave": "#BAF015",
};