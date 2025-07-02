import { HeadingRate } from "@/components/ui/SectionHeading";
import { roundTo8 } from "./roundTo8";
import { Rate } from "../api/types";

export const calculateInputAmountBasedOnAnotherOne = (
  amount: number | null,
  rate: Rate | null,
  position: "given" | "received"
): number | null => {
  if (!amount || !rate) return null;

  const { course } = rate;
  const actualRate = course;

  // // console.log(amount, course);
  const res = position === "given" ? amount * actualRate : amount / actualRate;
  return roundTo8(res);
};