import { ProjectData } from "@/shared/model/project";
import { CashIcon, RocketIcon, ShieldIcon, VisibilityOffIcon } from "@/shared/ui";
import { CRYPTON_THEME } from "../theme";

export const CRYPTON_PROJECT_DATA: ProjectData = {
  name: 'crypton',
  theme: CRYPTON_THEME,

  meta: {
    title: "Crypton Exchange",
    description: "Crypton Exchange - Telegram Mini App",
  },

  page: {
    home: {
      title: {
        text: `Crypton Exchange`
      },
      subtitle: `Быстрый и&nbsp;выгодный обмен криптовалюты.`,
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
        "https://drive.google.com/file/d/1oEP--IJ4Wpohf_KDdrbPrSdEWJa7EMFs/preview",
      termsUrl:
        "https://drive.google.com/file/d/1whzquuKMRZI6F64bledNR-IzA4EA-DA_/preview",
    },
    result: {
      video: {
        src: "/p2p.mp4",
        active: false,
      },
    },
  },
};