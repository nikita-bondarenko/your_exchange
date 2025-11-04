import { number } from "zod";
export const transferIdInputPathReferrencies: {
  [key in number]:
    | "fta"
    | "cards"
    | "chinese-platforms"
    | "invoice";
} = {
  1: "fta",
  2: "invoice",
  3: "cards",
  4: "chinese-platforms",
  5: "invoice",
};
