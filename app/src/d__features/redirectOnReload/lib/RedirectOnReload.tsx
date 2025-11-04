import {
  useAppSelector,
  useAppDispatch,
  setIsFirstPageLoading,
} from "@/shared/model/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const RedirectOnReload = () => {
  const isFirstPageLoading = useAppSelector(
    (state) => state.ui.isFirstPageLoading
  );
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isFirstPageLoading) {
      router.push("/");
      dispatch(setIsFirstPageLoading(false));
    }
  }, []);
  return <></>;
};
