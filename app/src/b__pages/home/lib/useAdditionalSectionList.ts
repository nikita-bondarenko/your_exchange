import { useThemeSwitcherClickHandler } from "@/d__features/themeSwitcher/lib";
import { PROJECT_NAME, TOTAL_PROJECTS_DATA } from "@/shared/config";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";

type Props = {
  policyUrl: string | undefined;
  termsUrl: string | undefined;
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

  const additionalSectionListItems = useMemo(
    () => [
      {
        text: "Профиль",
        onClick: toProfilePage,
      },
      {
        text: "Нас часто спрашивают",
        onClick: toFaqPage,
      },
      {
        text: "Соглашение",
        onClick: () => openUrl(termsUrl),
      },
      {
        text: "Политика AML",
        onClick: () => openUrl(policyUrl),
      },
      ...(PROJECT_NAME === "test"
        ? TOTAL_PROJECTS_DATA.map((project) => ({
            text: `${project.meta.title} Theme`,
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
