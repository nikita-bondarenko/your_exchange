import { ProjectData } from "@/shared/model/project";
import { RocketIcon, ShieldIcon } from "@/shared/ui";
import { BIP_THEME } from "../theme";

export const BIP_PROJECT_DATA: ProjectData = {
  name: "bip",
  theme: BIP_THEME,

  meta: {
    title: "BIP39 Exchange",
    description: "BIP39 Exchange - Telegram Mini App",
  },

  page: {
    home: {
      title: {
        image: {
          src: "/images/first-screen/bip.png",
          className:
            "block w-[200px] h-[80px] object-contain  ml-[-11px] mt-[-10px]",
        },
      },
      subtitle: `Безопасные операции с&nbsp;цифровыми активами`,
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
        "https://drive.google.com/file/d/1S9tq3B_j_IhAyvVAHN6KyQ4C4VcIW2w6/preview",
      termsUrl:
        "https://drive.google.com/file/d/1oqABsyEHGgyOqduvvUQuRk-UpTELRD-5/preview",
    },
    result: {
      video: {
        src: "/p2p.mp4",
        active: false,
      },
    },
  },
};
