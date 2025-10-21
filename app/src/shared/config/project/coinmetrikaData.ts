import { ProjectData } from "@/shared/model/project";
import { RocketIcon, ShieldIcon } from "@/shared/ui";
import { COINMETRIKA_THEME } from "../theme";

export const COINMETRIKA_PROJECT_DATA: ProjectData = {
  name: 'coinmetrika',
  theme: COINMETRIKA_THEME,

  meta: {
    title: "Coinmetrika Exchange",
    description: "Coinmetrika Exchange - Telegram Mini App",
  },

  page: {
    home: {
      title: {
        text: `Coinmetrika <br/>Exchange`
      },
      subtitle: `Покупка и продажа криптовалюты по&nbsp;выгодному&nbsp;курсу`,
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
        "https://drive.google.com/file/d/14NFieNWgcewmAX84wDUdatqCQwKfFG50/preview",
      termsUrl:
        "https://drive.google.com/file/d/10b-qAUrP9GMx0uMBYDOVfYiwbTLTOO7Z/preview",
    },
    result: {
      video: {
        src: "/p2p.mp4",
        active: false,
      },
    },
  },
};