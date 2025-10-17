import { CurrentProjectTheme } from "@/shared/model/theme";
import { LIGHT_THEME } from "./lightTheme";


export const MAX_SECRET_THEME: CurrentProjectTheme = {
  ...LIGHT_THEME,
  "--main-color": "#323232",

  "--text-button-main": "#FFFFFF",
  "--text-button-secondary": "#434343",
  "--text-button-first-screen-left": "#FFFFFF",
  "--text-button-first-screen-right": "#323232",

  "--background-button-first-screen-left": "#323232",
  "--background-button-first-screen-right": "#C0C0C0",
  "--background-button-secondary": "#FFFFFF",
  "--background-first-screen": "#fff",
  "--background-request-status": "#EBEBEB",

  "--border-button-secondary": "#323232",
};