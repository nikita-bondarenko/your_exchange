import {
  CarIcon,
  CashIcon,
  HomeIcon,
  PlanetIcon,
  RocketIcon,
  ShieldIcon,
  VisibilityOffIcon,
} from "@/shared/ui";
import { CRYPTUS_THEME } from "../theme";
import { ProjectData } from "@/shared/model/project";

export const CRYPTUS_PROJECT_DATA: ProjectData = {
  name: "cryptus",
  theme: CRYPTUS_THEME,

  meta: {
    title: "Cryptus Exchange",
    description: "Cryptus Exchange - Telegram Mini App",
  },

  page: {
    home: {
      title: {
        text: "CRYPTUS EXCHANGE",
      },
      subtitle: `Сервис, которым ты&nbsp;всегда хотел пользоваться.`,
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
        "https://drive.google.com/file/d/13uRZHUmrFDwylgMv4-kmLIL3eAMxf0Iv/preview",
      termsUrl:
        "https://drive.google.com/file/d/1CjTguI4oRfjfYCcvHKVZzafV_yOaEitf/preview",
    },
    result: {
      video: {
        src: "/p2p.mp4",
        active: true,
      },
    },
  },
};
