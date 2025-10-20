import { useThemeSwitcherClickHandler } from "@/d__features/themeSwitcher/lib";
import { ThemeButton } from "@/d__features/themeSwitcher/ui";
import { PROJECT_NAME, TOTAL_PROJECTS_DATA } from "@/shared/config";
import { CryptoIcon } from "@/shared/ui";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useMemo, useRef } from "react";

type Props = {
  policyUrl: string | undefined;
  termsUrl: string | undefined;
};

export type AdditionalButton = {
  children: ReactNode;
  onClick: () => void;
};


export const useAdditionalSectionList = ({ policyUrl, termsUrl }: Props) => {
  const router = useRouter();

  const toProfilePage = () => {
    router.push("/profile");
  };

  const toFaqPage = () => {
    router.push("/faq");
  };

  const openUrl = (url?: string) => window.open(url, "_blank");

  const [themeSwitcherClickHandler] = useThemeSwitcherClickHandler();

  const additionalSectionListItems = useMemo<AdditionalButton[]>(
    () => [
      {
        children: "Профиль",
        onClick: toProfilePage,
      },
      {
        children: "Нас часто спрашивают",
        onClick: toFaqPage,
      },
      {
        children: "Соглашение",
        onClick: () => openUrl(termsUrl),
      },
      {
        children: "Политика AML",
        onClick: () => openUrl(policyUrl),
      },
      ...(PROJECT_NAME === "test"
        ? TOTAL_PROJECTS_DATA.map((project) => ({
            children: (
              <ThemeButton project={project}></ThemeButton>
            ),
            onClick: () => themeSwitcherClickHandler(project.name),
          }))
        : []),
    ],
    [policyUrl, termsUrl]
  );

  return {
    additionalSectionListItems,
  };
};
