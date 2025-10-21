import { CarIcon, HomeIcon, PlanetIcon } from "@/shared/ui";
import { TEST_THEME } from "../theme/testTheme";
import { ProjectData } from "@/shared/model/project";

export const TEST_PROJECT_DATA: ProjectData = {
  name: "test",
  theme: TEST_THEME,

  meta: {
    title: "Test Change",
    description: "Test Change - Telegram Mini App",
  },

  page: {
    home: {
      title: {
        text: "Test Change"
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
