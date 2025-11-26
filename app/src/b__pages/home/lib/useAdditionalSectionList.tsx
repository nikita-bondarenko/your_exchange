import { useThemeSwitcherClickHandler } from "@/d__features/themeSwitcher/lib";
import { ThemeButton } from "@/d__features/themeSwitcher/ui";
import { useTrackUserAction } from "@/d__features/userDataDisplay/lib";
import { PROJECT_NAME, TOTAL_PROJECTS_DATA_ARR } from "@/shared/config";
import { useAppSelector } from "@/shared/model/store";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";

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

  const sessionId = useAppSelector(state => state.user.sessionId)

  const { trackPushButton } = useTrackUserAction();

  const additionalSectionListItems = useMemo<AdditionalButton[]>(
    () => [
      {
        children: "Профиль",
        onClick: () => {
          toProfilePage();
          trackPushButton("Профиль");
        },
      },
      {
        children: "Нас часто спрашивают",
        onClick: () => {
          toFaqPage();
          trackPushButton("Нас часто спрашивают");
        },
      },
      ...(termsUrl
        ? [
            {
              children: "Соглашение",
              onClick: () => {
                openUrl(termsUrl);
                trackPushButton("Соглашение");
              },
            },
          ]
        : []),
      ...(policyUrl
        ? [
            {
              children: "Политика AML",
              onClick: () => {
                openUrl(policyUrl);
                trackPushButton("Политика AML");
              },
            },
          ]
        : []),
      ...(PROJECT_NAME === "test"
        ? TOTAL_PROJECTS_DATA_ARR.map((project) => ({
            children: <ThemeButton project={project}></ThemeButton>,
            onClick: () => {
              themeSwitcherClickHandler(project.name);
            },
          }))
        : []),
    ],
    [policyUrl, termsUrl, sessionId]
  );

  return {
    additionalSectionListItems,
  };
};
