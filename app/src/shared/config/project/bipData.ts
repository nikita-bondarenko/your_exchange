import { ProjectData } from "@/shared/model/project";
import { RocketIcon, ShieldIcon } from "@/shared/ui";
import { BIP_THEME, CRYPTUS_THEME } from "../theme";

export const BIP_PROJECT_DATA: ProjectData = {
  name: "bip",
  theme: BIP_THEME,

  meta: {
    title: "Cryptus Exchange",
    description: "Cryptus Exchange - Telegram Mini App",
  },

  page: {
    home: {
      title: "CRYPTUS EXCHANGE",
      subtitle: `Сервис, которым ты&nbsp;всегда хотел пользоваться.`,
      descriptionList: [
        {
          icon: RocketIcon,
          text: "Быстрый обмен",
        },
        {
          icon: ShieldIcon,
          text: "Безопасность",
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