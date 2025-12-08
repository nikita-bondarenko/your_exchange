import { useCallSupport } from "@/d__features/support/lib";
import { ProjectData, ProjectName } from "@/shared/model/project";
import {ReactElement, useCallback, useEffect, useMemo, useRef} from "react";
import { CryptoIcon, ReloadIcon, SupportIcon } from "@/shared/ui";
import { PROJECT_NAME, TOTAL_PROJECTS_DATA_ARR } from "@/shared/config";
import {
  switchTheme,
  useThemeSwitcherClickHandler,
} from "@/d__features/themeSwitcher/lib";
import {  useAppSelector } from "@/shared/model/store";


type MenuButton = {
  icon: ReactElement;
  text: string;
  onClick: () => void;
  className?: string;
};

type Props = {
  closeMenu: () => void;

};

export const useMenuButtons = ({ closeMenu }: Props) => {
  const projectName = useAppSelector((state) => state.ui.projectName);
    const userId = useAppSelector((state) => state.user.id);
    const isAppReady = useAppSelector((state) => state.ui.isAppReady);


  const reloadButtonHandler = () => {
    try {
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const { callSupport } = useCallSupport({userId, isAppReady});

  const [themeSwitcherClickHandler] = useThemeSwitcherClickHandler();

  const themeButtonHandler = (projectName: ProjectName) => {
    closeMenu();
    themeSwitcherClickHandler(projectName);
  };

  const menuButtons = useMemo<MenuButton[]>(
    () => [
      {
        icon: <SupportIcon color="var(--text-main)" />,
        text: "Задать вопрос",
        onClick: callSupport,
      },
      {
        icon: <ReloadIcon color="var(--text-main)" />,
        text: "Обновить страницу",
        onClick: reloadButtonHandler,
        className: "[&]:gap-6",
      },
      ...(PROJECT_NAME === "test"
        ? TOTAL_PROJECTS_DATA_ARR.map((project) => ({
            icon: (
              <CryptoIcon
                className="w-15 h-15 shrink-0"
                color={project.theme["--main-color"]}
              />
            ),
            text: `${project.meta.title} Theme`,
            className: "[&]:text-[var(--text-main)] [&]:gap-9",
            onClick: () => themeButtonHandler(project.name),
          }))
        : []),
    ],
    [projectName, userId,isAppReady]
  );

  return { menuButtons };
};
