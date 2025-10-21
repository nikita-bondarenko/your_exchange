import { ProjectName, ProjectServerData } from "@/shared/model/project";
import { ALEX_SERVER_DATA } from "./alex";
import { BIP_SERVER_DATA } from "./bip";
import { COINMETRIKA_SERVER_DATA } from "./coinmetrika";
import { CRYPTOWEB_SERVER_DATA } from "./cryptoWeb";
import { CRYPTON_SERVER_DATA } from "./crypton";
import { CRYPTORO_SERVER_DATA } from "./cryptoro";
import { CRYPTUS_SERVER_DATA } from "./cryptus";
import { SECRET_SERVER_DATA } from "./secret";
import { SUNSCRYPT_SERVER_DATA } from "./sunscrypt";
import { TEST_SERVER_DATA } from "./test";
import { TOP_SERVER_DATA } from "./top";

export const TOTAL_SERVER_DATA: {[key in ProjectName]: ProjectServerData} = {
 'alex': ALEX_SERVER_DATA,
 'bip': BIP_SERVER_DATA,
 'coinmetrika': COINMETRIKA_SERVER_DATA,
 'crypto-web': CRYPTOWEB_SERVER_DATA,
 'crypton': CRYPTON_SERVER_DATA,
 'cryptoro': CRYPTORO_SERVER_DATA,
 'cryptus': CRYPTUS_SERVER_DATA,
 'max-secret': SECRET_SERVER_DATA,
 'sunscrypt': SUNSCRYPT_SERVER_DATA,
 'test': TEST_SERVER_DATA,
 'top': TOP_SERVER_DATA
}