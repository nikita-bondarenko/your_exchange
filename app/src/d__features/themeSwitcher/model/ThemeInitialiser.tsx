import { PROJECT_DATA } from "@/shared/config";
import { memo, useEffect } from "react";
import { switchTheme } from "../lib";

export const ThemeInitialiser = () => {

  useEffect(() => {
    switchTheme(PROJECT_DATA.theme);
  }, []);
  return <></>;
};
