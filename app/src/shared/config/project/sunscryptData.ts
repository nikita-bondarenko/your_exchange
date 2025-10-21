import { CarIcon, HomeIcon, PlanetIcon } from "@/shared/ui";
import { MAX_SECRET_THEME, SUNSCRYPT_THEME } from "../theme";
import { ProjectData } from "@/shared/model/project";
import { FirstScreenBackground } from "@/shared/ui/background";

export const SUNSCRYPT_PROJECT_DATA: ProjectData = {
    name: "sunscrypt",
  theme: SUNSCRYPT_THEME,

  meta: {
    title: "Sunscrypt Exchange",
    description: "Sunscrypt Exchange - Telegram Mini App",
  },

  page: {
    home: {
      title: {
        text: "Sunscrypt Exchange"
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
        "https://drive.google.com/file/d/1y_TRcbEfuv0eBk27IXmi1VpXAOEqSLz-/preview",
      termsUrl:
        "https://drive.google.com/file/d/1fEtM5XgRzo_knn3DyV1PhFlWDAXlEw14/preview",
    },
    result: {
      video: {
        src: "/p2p.mp4",
        active: false,
      },
    },
  },
};
