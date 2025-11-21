import { ProjectData } from "@/shared/model/project";
import { CashIcon, RocketIcon, ShieldIcon, VisibilityOffIcon } from "@/shared/ui";
import { COINMETRIKA_THEME } from "../theme";

export const COINMETRIKA_PROJECT_DATA: ProjectData = {
  name: 'coinmetrika',
  theme: COINMETRIKA_THEME,

  meta: {
    title: "Metrika Exchange",
    description: "Metrika Exchange - Telegram Mini App",
  },

  page: {

    home: {
      title: {
        text: `Metrika <br/>Exchange`
      },
      subtitle: `Покупка и продажа криптовалюты по&nbsp;выгодному&nbsp;курсу`,
      descriptionList: [
           {
             icon: RocketIcon,
             text: "Быстрый обмен",
             modeTypeWhenVisible: "exchange",
           },
           {
             icon: ShieldIcon,
             text: "Безопасность",
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
        "https://drive.google.com/file/d/1O-EunRgSTVfbiLJUhccB3WqEsjs1IQPQ/preview",
      termsUrl:
        "https://drive.google.com/file/d/1LUeRKUY3kJG3Ll8-wWDeuf0XvKZYTCgQ/preview",
    },
    result: {
      video: {
        src: "/p2p.mp4",
        active: false,
      },
    },
  },
};
