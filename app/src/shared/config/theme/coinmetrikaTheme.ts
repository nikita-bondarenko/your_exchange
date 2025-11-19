import { CurrentProjectTheme } from "@/shared/model/theme";
import { DARK_THEME } from "./darkTheme";

export const COINMETRIKA_THEME: CurrentProjectTheme = {
  ...DARK_THEME,

  "--main-color": "#AD41D7",

  "--text-main-screen-title": "#AD41D7",
  "--text-main-screen-subtitle": "#CDCDCD",

  "--text-button-main": "#FFFFFF",
  "--text-button-secondary": "#000000",
  "--text-button-first-screen-left": "#FFFFFF",
  "--text-button-first-screen-right": "#323232",

  "--background-button-first-screen-left": "#AD41D7",
  "--background-button-first-screen-right": "#F5F5F5",
  "--background-button-secondary": "#F5F5F5",
  "--background-first-screen":
    "linear-gradient(149.32deg, #222222 5.59%, #363636 105.56%)",
  "--background-request-status": "#383838",
  "--background-button-profile": "#AD41D7",
  "--background-profile-icon": "#282828",

  "--border-profile-icon": "#000000",
  "--profile-button-wave": "#AD41D7",
  "--progress-bar-active": "#AD41D7",
  "--result-screen-clock": "#AD41D7",
};
