import { PROJECT_DATA } from "@/shared/config";
import { memo, useEffect } from "react";
import { switchTheme } from "../lib";
import { setPageData, useAppDispatch } from "@/shared/model/store";

export const ThemeInitialiser = () => {
  // console.log('ThemeInitialiser')
  const dispatch = useAppDispatch();

  useEffect(() => {
    switchTheme(PROJECT_DATA.theme);
    dispatch(setPageData(PROJECT_DATA.page));
  }, []);
  return <></>;
};
