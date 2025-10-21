import { setPageData, useAppDispatch, setProjectName } from "@/shared/model/store";
import { switchTheme } from "./switchTheme";
import { ProjectName } from "@/shared/model/project";
import { TOTAL_PROJECTS_DATA } from "@/shared/config";

export const useThemeSwitcherClickHandler = () => {
  const dispatch = useAppDispatch();

  const clickHandler = (projectName: ProjectName) => {
    const projectData = TOTAL_PROJECTS_DATA[projectName]

    if (projectData) {
      switchTheme(projectData.theme);
      dispatch(setProjectName(projectData.name));
      dispatch(setPageData(projectData.page));
    }
  };
  return [clickHandler];
};
