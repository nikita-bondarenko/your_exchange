import { CardIcon, CashIcon, VisibilityOffIcon } from "@/shared/ui";
import { ALEX_THEME } from "../theme";
import { ProjectData } from "@/shared/model/project";

export const ALEX_PROJECT_DATA: ProjectData = {
  name: "alex",
  theme: ALEX_THEME,

  meta: {
    title: "Alex Exchange",
    description: "Alex Exchange - Telegram Mini App",
  },

  page: {
    home: {
      title: {
        text: "ALEX <br/>CHANGE",
      },
      subtitle: `Покупка и продажа <br />криптовалюты по <br />выгодному курсу`,
      descriptionList: [
        {
          icon: CashIcon,
          iconClassName: "w-20",
          text: "Наличный обмен",
          modeTypeWhenVisible: "exchange",
        },
        {
          icon: CardIcon,
          iconClassName: "w-20 h-19",
          text: "Обмен по карте",
          modeTypeWhenVisible: "exchange",
        },
        {
          icon: CashIcon,
          text: "Платежный агент",
          modeTypeWhenVisible: "transfer",
        },
        {
          icon: VisibilityOffIcon,
          text: "Конфиденциальность",
          modeTypeWhenVisible: "transfer",
        },
      ],
      firstScreenBackgroundImage: undefined,
      policyUrl:
        "https://drive.google.com/file/d/1QjauBFT0Fb9GqRzjkIvX6p8kSv963CJ9/preview",
      termsUrl:
        "https://drive.google.com/file/d/1xiffSuB9rNRWu76tzzzS2Zp4kzG4gMpT/preview",
    },
    result: {
      video: {
        src: "/p2p.mp4",
        active: false,
      },
    },
  },
};
