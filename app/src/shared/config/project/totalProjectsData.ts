import { ProjectData, ProjectName } from "@/shared/model/project";
import { ALEX_PROJECT_DATA } from "./alexData";
import { TEST_PROJECT_DATA } from "./testData";
import { CRYPTUS_PROJECT_DATA } from "./cryptusData";
import { MAX_SECRET_PROJECT_DATA } from "./maxSecretData";
import { BIP_PROJECT_DATA } from "./bipData";
import { COINMETRIKA_PROJECT_DATA } from "./coinmetrikaData";
import { CRYPTO_WEB_PROJECT_DATA } from "./cryptoWebData";
import { CRYPTON_PROJECT_DATA } from "./cryptonData";
import { CRYPTORO_PROJECT_DATA } from "./cryptoroData";
import { SUNSCRYPT_PROJECT_DATA } from "./sunscryptData";
import { TOP_PROJECT_DATA } from "./topData";

export const TOTAL_PROJECTS_DATA: { [key in ProjectName]: ProjectData } = {
  cryptus: CRYPTUS_PROJECT_DATA,
  alex: ALEX_PROJECT_DATA,
  bip: BIP_PROJECT_DATA,
  coinmetrika: COINMETRIKA_PROJECT_DATA,
  "crypto-web": CRYPTO_WEB_PROJECT_DATA,
  crypton: CRYPTON_PROJECT_DATA,
  cryptoro: CRYPTORO_PROJECT_DATA,
  "max-secret": MAX_SECRET_PROJECT_DATA,
  sunscrypt: SUNSCRYPT_PROJECT_DATA,
  top: TOP_PROJECT_DATA,
  test: TEST_PROJECT_DATA,
};

export const TOTAL_PROJECTS_DATA_ARR = Object.values(TOTAL_PROJECTS_DATA).map(
  (value) => value
);
