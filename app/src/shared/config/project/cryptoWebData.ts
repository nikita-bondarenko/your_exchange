import { ProjectData } from "@/shared/model/project";
import { CashIcon, RocketIcon, ShieldIcon, VisibilityOffIcon } from "@/shared/ui";
import { CRYPTO_WEB_THEME } from "../theme";

export const CRYPTO_WEB_PROJECT_DATA: ProjectData = {
  name: 'crypto-web',
  theme: CRYPTO_WEB_THEME,
  meta: {
    title: "Crypto Web Exchange",
    description: "Crypto Web Exchange - Telegram Mini App",
  },

  page: {

    home: {
      title: {
        text: `Сrypto Web Exchange`
      },
      subtitle: `Покупка и продажа <br/>криптовалюты <br/>по выгодному курсу`,
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
        "https://drive.google.com/file/d/1SEwrb9AZb7nK7BwbX31Ox4H4PvPOhMrZ/preview",
      termsUrl:
        "https://drive.google.com/file/d/1goXTcWxUa34g7Q1XEQrFYcxurUICaKSB/preview",
    },
    result: {
      video: {
        src: "/p2p.mp4",
        active: false,
      },
    },
  },
};