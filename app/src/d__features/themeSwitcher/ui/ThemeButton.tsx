import { ProjectData } from "@/shared/model/project";
import { CryptoIcon } from "@/shared/ui";

type Props = {
  project: ProjectData;
};

export const ThemeButton = ({ project }: Props) => (
  <div className="flex items-center gap-10">
    {" "}
    <CryptoIcon
      className="w-15 h-15 shrink-0"
      color={project.theme["--main-color"]}
    />
    <span className="text-13 leading-normal text-left">
      {`${project.meta.title} Theme`}
    </span>
  </div>
);
