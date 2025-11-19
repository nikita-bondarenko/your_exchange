import { CurrentProjectTheme } from "@/shared/model/theme";
import { LIGHT_THEME } from "./lightTheme";

export const WHITE_THEME: CurrentProjectTheme = {
  ...LIGHT_THEME,
  "--main-color": "#FFD000",

  "--text-main-screen-title": "#333333",
  "--text-main-screen-subtitle": "#333333",

  "--text-button-main": "#211F18",
  "--text-button-secondary": "#211F18",
  "--text-button-first-screen-left": "#211F18",
  "--text-button-first-screen-right": "#211F18",

  "--text-main-screen-description": "#F2F2F2",

  "--background-button-first-screen-left": "#FFD000",
  "--background-button-first-screen-right": "#F5F5F5",
  "--background-button-secondary": "#D3D3D3",
  "--background-first-screen":
    "#F4F4F4",
  "--background-request-status": 'linear-gradient(84.28deg, #9C9C9C 27.74%, #8F8F8F 72.26%)',
  "--background-first-screen-description": 'linear-gradient(84.28deg, #9C9C9C 27.74%, #8F8F8F 72.26%)',
  "--background-button-profile": "#262626",
  "--background-profile-icon": "#E3E3E3",
  "--background-exchange-type-selected": "#F6F6F6",
  "--profile-button-wave": "#9C9C9C",

  "--border-button-secondary": "transparent",
  "--border-profile-icon": "#FFFFFF",
  '--progress-bar-active': "#696969",
  '--result-screen-clock': "#696969"
};
