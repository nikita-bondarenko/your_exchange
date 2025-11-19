import { CashIcon, RocketIcon, ShieldIcon, VisibilityOffIcon } from "@/shared/ui";
import { ProjectData } from "@/shared/model/project";
import { WhiteWayFirstScreenBackground} from '@/shared/ui/background'
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
      subtitle: `Покупка и&nbsp;продажа <br />
                  криптовалюты <br />
                  по&nbsp;выгодному курсу`,
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
              { icon: VisibilityOffIcon, text: "Конфиденциальность", modeTypeWhenVisible: "transfer" },
            ],
      firstScreenBackgroundImage: WhiteWayFirstScreenBackground,
    //   policyUrl:
    //     "https://drive.google.com/file/d/1kqS3k6ykV82Jcbh7cSw7URyxuKR6bqFi/preview",
    //   termsUrl:
    //     "https://drive.google.com/file/d/1CDv9U5B9EaDOUv_MsrGW3TkpyWmS7cmf/preview",
    },
    result: {
      video: {
        src: "/p2p.mp4",
        active: false,
      },
    },
  },
};
