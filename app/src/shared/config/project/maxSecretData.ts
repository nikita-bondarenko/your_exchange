import { CarIcon, HomeIcon, PlanetIcon } from "@/shared/ui";
import { MAX_SECRET_THEME } from "../theme";
import { ProjectData } from "@/shared/model/project";

export const MAX_SECRET_PROJECT_DATA: ProjectData = {
    name: "max-secret",
  theme: MAX_SECRET_THEME,

  meta: {
    title: "MaxSecret Change",
    description: "MaxSecret Change - Telegram Mini App",
  },

  page: {
    home: {
      title: "Секретный Обменник",
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
