import { CurrentProjectTheme } from "@/shared/model/theme";
import { LIGHT_THEME } from "./lightTheme";

export const ALEX_THEME: CurrentProjectTheme = {
  ...LIGHT_THEME,

  "--main-color": "#23E2A5",

  "--text-button-main": "#FFFFFF",
  "--text-button-secondary": "#FFFFFF",
  "--text-button-first-screen-left": "#FFFFFF",
  "--text-button-first-screen-right": "#262626",
  "--text-main-screen-description": "#515151",
  "--text-main-screen-subtitle": "#000",

  "--background-first-screen-description": "#D7FFDF",
  "--background-button-first-screen-left": "#262626",
  "--background-button-first-screen-right": "#F5F5F5",
  "--background-button-secondary": "#262626",
  "--background-first-screen":
    "linear-gradient(149.32deg, #CCFC44 5.59%, #5DF192 57.98%, #00CAFF 105.56%)",
  "--background-button-profile": "#262626",
  "--background-request-status": "#D7FFDF",
  "--profile-button-wave": "#d2f0ff",

  "--border-button-secondary": "#262626",
  "--progress-bar-active": "#23E2A5",
  "--result-screen-clock": "#23E2A5",
};
