import {
  CashIcon,
  RocketIcon,
  ShieldIcon,
  VisibilityOffIcon,
} from "@/shared/ui";
import { ProjectData } from "@/shared/model/project";
import { WhiteWayFirstScreenBackground } from "@/shared/ui/background";
import { WHITE_THEME } from "../theme/whiteWayTheme";

export const WHITE_PROJECT_DATA: ProjectData = {
  name: "white-way",
  theme: WHITE_THEME,

  meta: {
    title: "White Way Exchange",
    description: "White Way Exchange - Telegram Mini App",
  },

  page: {
    home: {
      title: {
        text: "White Way <br />Exchange",
      },
      subtitle: `Покупка и&nbsp;продажа криптовалюты с&nbsp;поддержкой наличных и&nbsp; безналичных способов!`,
      descriptionList: [
        {
          icon: RocketIcon,
          text: "Быстрый обмен",
          modeTypeWhenVisible: "exchange",
        },
        {
          icon: ShieldIcon,
          text: "Безопасные сделки",
          modeTypeWhenVisible: "exchange",
        },
         {
          icon: CashIcon,
          text: "Прозрачный курс ",
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
      firstScreenBackgroundImage: WhiteWayFirstScreenBackground,
      policyUrl:
        "https://drive.google.com/file/d/1Gq0Y2t2LimC3i1mMP9wr2hRlwZgX9sut/preview",
      termsUrl:
        "https://drive.google.com/file/d/16oiDSQxb9IXUy4LZf7lGj4nIx2JDVtaw/preview",
    },
    result: {
      video: {
        src: "/p2p.mp4",
        active: false,
      },
    },
  },
};
