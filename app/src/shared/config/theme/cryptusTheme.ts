import { CurrentProjectTheme } from "@/shared/model/theme";
import { DARK_THEME } from "./darkTheme";
import { LIGHT_THEME } from "./lightTheme";

export const CRYPTUS_THEME: CurrentProjectTheme = {
  ...LIGHT_THEME,

  "--main-color": "#43C0FF",

  "--text-button-main": "#FFFFFF",
  "--text-button-secondary": "#FFFFFF",
  "--text-button-first-screen-left": "#FFFFFF",
  "--text-button-first-screen-right": "#FFFFFF",
  "--text-main-screen-description": "#759EB2",
  "--text-main-screen-subtitle": "#000000",

  "--background-first-screen-description": "#E4F5FF",
  "--background-request-status": "#fff",
  "--background-button-first-screen-left": "#43C0FF",
  "--background-button-first-screen-right": "#262626",
  "--background-button-secondary": "#262626",
  "--background-first-screen":
    "linear-gradient(149.32deg, #C7ECFF 5.59%, #B8D1F6 105.56%)",
  "--background-button-profile": "#6CCEFF",

  "--border-button-secondary": "#262626",
  "--border-placeholder": "#E9E9E9",
  "--profile-button-wave": "#6CCEFF",

  "--divider-main": "#C0C0C0",
  "--divider-secondary": "#C3C3C3",
  "--divider-thirdary": "#E8E8E8",
  "--progress-bar-active": "#43C0FF",
  "--result-screen-clock": "#43C0FF",
};
