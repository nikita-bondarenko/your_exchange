import { useCallSupport } from "@/d__features/support/lib";
import { ProjectData, ProjectName } from "@/shared/model/project";
import { ReactElement, useMemo, useRef } from "react";
import { CryptoIcon, ReloadIcon, SupportIcon } from "@/shared/ui";
import { PROJECT_NAME, TOTAL_PROJECTS_DATA } from "@/shared/config";
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

  const reloadButtonHandler = () => {
    try {
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const { callSupport } = useCallSupport();

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
        ? TOTAL_PROJECTS_DATA.map((project) => ({
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
    [projectName]
  );

  return { menuButtons };
};
