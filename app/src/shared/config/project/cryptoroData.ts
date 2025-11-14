import { ProjectData } from "@/shared/model/project";
import { CashIcon, RocketIcon, ShieldIcon, VisibilityOffIcon } from "@/shared/ui";
import { CRYPTORO_THEME } from "../theme";

export const CRYPTORO_PROJECT_DATA: ProjectData = {
  name: 'cryptoro',
  theme: CRYPTORO_THEME,

  meta: {
    title: "Cryptoro Exchange",
    description: "Cryptoro Exchange - Telegram Mini App",
  },

  page: {

    home: {
      title: {
        text: `CrypToro <br/>Exchange`
      },
      subtitle: `Покупка и продажа <br />криптовалюты <br />по выгодному курсу`,
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
        "https://drive.google.com/file/d/1viE-JdwTDLBfPxOaqt5wJA7mlMuwMMCu/preview",
      termsUrl:
        "https://drive.google.com/file/d/1gLDio16eVIk4-cpmA6JBDap22kKJFHIE/preview",
    },
    result: {
      video: {
        src: "/p2p.mp4",
        active: false,
      },
    },
  },
};