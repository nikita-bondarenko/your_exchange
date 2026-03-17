import { CurrentProjectTheme } from "@/shared/model/theme";
import { LIGHT_THEME } from "./lightTheme";

export const TVOI_THEME: CurrentProjectTheme = {
  ...LIGHT_THEME,
  "--main-color": "#D6C197",

  "--text-main-screen-title": "#333333",
  "--text-main-screen-subtitle": "#333333",

  "--text-button-main": "#211F18",
  "--text-button-secondary": "#211F18",
  "--text-button-first-screen-left": "#211F18",
  "--text-button-first-screen-right": "#211F18",

  "--text-main-screen-description": "#7C7C7C",

  "--background-button-first-screen-left": "#D6C197",
  "--background-button-first-screen-right": "#F5F5F5",
  "--background-button-secondary": "#D3D3D3",
  "--background-first-screen":
    "#E4E4E4",
  "--background-request-status": 'linear-gradient(84.28deg, #D5D5D5 27.74%, #E4E4E4 72.26%)',
  "--background-first-screen-description": '#DEDEDE',
  "--background-button-profile": "#262626",
  "--background-profile-icon": "#E3E3E3",
  "--background-exchange-type-selected": "#F6F6F6",
  "--profile-button-wave": "#D6C197",

  "--border-button-secondary": "transparent",
  "--border-profile-icon": "#FFFFFF",
  '--progress-bar-active': "#696969",
  '--result-screen-clock': "#696969",
  "--background-global":"#F1F1F1"
};
