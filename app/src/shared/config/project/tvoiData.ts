import {
    CashIcon,
    RocketIcon,
    ShieldIcon,
    VisibilityOffIcon,
  } from "@/shared/ui";
  import { ProjectData } from "@/shared/model/project";
  import { WhiteWayFirstScreenBackground } from "@/shared/ui/background";
  import { WHITE_THEME } from "../theme/whiteWayTheme";
import { TVOI_THEME } from "../theme/tvoiTheme";
  
  export const TVOI_PROJECT_DATA: ProjectData = {
    name: "tvoi",
    theme: TVOI_THEME,
  
    meta: {
      title: "Tvoi Obmen",
      description: "Tvoi Obmen - Telegram Mini App",
    },
  
    page: {
      home: {
        title: {
          text: "Твой обмен",
        },
        subtitle: `Покупка и&nbsp;продажа криптовалюты с&nbsp;поддержкой наличных и&nbsp;безналичных способов!`,
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
  