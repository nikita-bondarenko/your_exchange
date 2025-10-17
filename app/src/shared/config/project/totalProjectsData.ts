import { ProjectData, ProjectName } from "@/shared/model/project";
import { ALEX_PROJECT_DATA } from "./alexData";
import { TEST_PROJECT_DATA } from "./testData";
import { CRYPTUS_PROJECT_DATA } from "./cryptusData";
import { MAX_SECRET_PROJECT_DATA } from "./maxSecretData";

export const TOTAL_PROJECTS_DATA: ProjectData[] = [
  TEST_PROJECT_DATA,
  ALEX_PROJECT_DATA,
  CRYPTUS_PROJECT_DATA,
  MAX_SECRET_PROJECT_DATA,
];
