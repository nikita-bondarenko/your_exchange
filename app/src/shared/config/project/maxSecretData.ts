import {
  CarIcon,
  CashIcon,
  HomeIcon,
  PlanetIcon,
  VisibilityOffIcon,
} from "@/shared/ui";
import { MAX_SECRET_THEME } from "../theme";
import { ProjectData } from "@/shared/model/project";
import { FirstScreenBackground } from "@/shared/ui/background";

export const MAX_SECRET_PROJECT_DATA: ProjectData = {
  name: "max-secret",
  theme: MAX_SECRET_THEME,

  meta: {
    title: "MaxSecret Change",
    description: "MaxSecret Change - Telegram Mini App",
  },

  page: {
    home: {
      title: {
        text: "Секретный Обменник",
      },
      subtitle: `Покупка и&nbsp;продажа <br />
                  криптовалюты <br />
                  по&nbsp;выгодному курсу`,
      descriptionList: [
        {
          icon: HomeIcon,
          text: "Наличные в офисе",
          modeTypeWhenVisible: "exchange",
        },
        {
          icon: CarIcon,
          text: "Курьерские доставки",
          modeTypeWhenVisible: "exchange",
        },
        { icon: PlanetIcon, text: "ВЭД", modeTypeWhenVisible: "exchange" },
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
      firstScreenBackgroundImage: FirstScreenBackground,
      policyUrl:
        "https://drive.google.com/file/d/11R9HxvSLxu2x-k967SvTBz22MiVQnC6X/preview",
      termsUrl:
        "https://drive.google.com/file/d/1ySzRHe1RemQ36enMByibD76W-N_QfRLk/preview",
    },
    result: {
      video: {
        src: "/p2p.mp4",
        active: false,
      },
    },
  },
};
