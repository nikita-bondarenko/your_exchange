import { DirectionType } from "@/redux/api/types";
import { CurrencyType } from "@/redux/slices/exchangeSlice/exchangeSlice";

export const calculateDirections = (giveType: CurrencyType, getType: CurrencyType) : DirectionType => {
    if (giveType === "COIN" && getType === "BANK") {
        return 'COIN - BANK';
    } else if (giveType === "COIN" && getType === "CASH") {
        return 'COIN - CASH';
    } else if (giveType === "BANK" && getType === "COIN") {
        return 'BANK - COIN';
    }  else if (giveType === "CASH" && getType === "COIN") {
        return 'CASH - COIN';
    }
    return 'COIN - BANK';
}

