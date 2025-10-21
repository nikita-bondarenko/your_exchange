import { CarIcon, HomeIcon, PlanetIcon } from "@/shared/ui";
import { ProjectData } from "@/shared/model/project";
import { FirstScreenBackground } from "@/shared/ui/background";
import { TOP_THEME } from "../theme/topTheme";

export const TOP_PROJECT_DATA: ProjectData = {
  name: "top",
  theme: TOP_THEME,

  meta: {
    title: "Top Exchange",
    description: "Top Exchange - Telegram Mini App",
  },

  page: {
    home: {
      title: {
        text: "Top Exchange",
      },
      subtitle: `Покупка и&nbsp;продажа <br />
                  криптовалюты <br />
                  по&nbsp;выгодному курсу`,
      descriptionList: [
        {
          icon: HomeIcon,
          text: "Наличные в офисе",
        },
        {
          icon: CarIcon,
          text: "Курьерские доставки",
        },
        { icon: PlanetIcon, text: "ВЭД" },
      ],
      firstScreenBackgroundImage: undefined,
      policyUrl:
        "https://drive.google.com/file/d/1kqS3k6ykV82Jcbh7cSw7URyxuKR6bqFi/preview",
      termsUrl:
        "https://drive.google.com/file/d/1CDv9U5B9EaDOUv_MsrGW3TkpyWmS7cmf/preview",
    },
    result: {
      video: {
        src: "/p2p.mp4",
        active: false,
      },
    },
  },
};
