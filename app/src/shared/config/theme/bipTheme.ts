import { CurrentProjectTheme } from "@/shared/model/theme";
import { DARK_THEME } from "./darkTheme";

export const BIP_THEME: CurrentProjectTheme = {
    ...DARK_THEME,
  
    "--main-color": "#F09810",

  "--text-main-screen-title": "#F09810",
  "--text-main-screen-subtitle": "#CDCDCD",

  "--text-button-main": "#000000",
  "--text-button-secondary": "#000000",
  "--text-button-first-screen-left": "#000000",
  "--text-button-first-screen-right": "#323232",

  "--background-button-first-screen-left": "#F09810",
  "--background-button-first-screen-right": "#F5F5F5",
  "--background-button-secondary": "#F5F5F5",
  "--background-first-screen":
    "linear-gradient(149.32deg, #F09810 5.59%, #FF902F 105.56%)",
  "--background-request-status": "#383838",
  "--background-button-profile": "#F09810",
  "--background-profile-icon": "#282828",

  "--border-profile-icon": "#000000",
    "--profile-button-wave": "#F09810"

};