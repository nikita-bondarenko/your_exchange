import { ProjectName } from "@/shared/model/project";
import {  BaseTheme, CurrentProjectTheme, Theme } from "../../model/theme";
import { DARK_THEME } from "./darkTheme";
import { LIGHT_THEME } from "./lightTheme";
import { ALEX_THEME } from "./alexTheme";
import { BIP_THEME } from "./bipTheme";
import { COINMETRIKA_THEME } from "./coinmetrikaTheme";
import { CRYPTO_WEB_THEME } from "./cryptoWebTheme";
import { CRYPTON_THEME } from "./cryptonTheme";
import { CRYPTORO_THEME } from "./cryptoroTheme";
import { CRYPTUS_THEME } from "./cryptusTheme";
import { MAX_SECRET_THEME } from "./maxSecretTheme";
import { SUNSCRYPT_THEME } from "./sunscryptTheme";
import { TOP_THEME } from "./topTheme";
import { TEST_THEME } from "./testTheme";
import { WHITE_THEME } from "./whiteWayTheme";

export const BASE_THEMES: {[key in Theme]: BaseTheme}  = {
    'dark': DARK_THEME,
    'light':  LIGHT_THEME
}

export const PROJECT_THEMES: {[key in ProjectName]: CurrentProjectTheme} ={
    'alex': ALEX_THEME,
    'bip': BIP_THEME,
    'coinmetrika': COINMETRIKA_THEME,
    'crypto-web': CRYPTO_WEB_THEME,
    'crypton': CRYPTON_THEME,
    'cryptoro': CRYPTORO_THEME,
    'cryptus': CRYPTUS_THEME,
    'max-secret': MAX_SECRET_THEME,
    'sunscrypt': SUNSCRYPT_THEME,
    'top': TOP_THEME,
    "test": TEST_THEME,
    'white-way': WHITE_THEME
}




