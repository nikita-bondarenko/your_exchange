import {
  setTransferAbroadAreErrorsVisible,
  useAppDispatch,
} from "@/shared/model/store";
import { useRouter } from "next/navigation";

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
    if (isFormValid) {
      router.push(nextPagePath);
    } else {
      dispatch(setTransferAbroadAreErrorsVisible(true));
    }
  };

  return [callback];
};
