

"use client"
import { setTransferAbroadAreErrorsVisible } from "@/d__features/transferAbroad/model";
import { useAppDispatch } from "@/shared/model/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  nextPagePath: string;
  isFormValid?: boolean;
};

export const useRouterPushCallback = ({
  nextPagePath,
  isFormValid = true,
}: Props) => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const callback = () => {
    console.log(isFormValid)
    if (isFormValid) {
      router.push(nextPagePath);
    } else {
      dispatch(setTransferAbroadAreErrorsVisible(true));
    }
  };

  useEffect(() => {
    console.log(isFormValid)
  }, [isFormValid])

  return [callback];
};
