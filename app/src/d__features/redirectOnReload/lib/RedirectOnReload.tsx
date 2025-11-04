import {
  useAppSelector,
  useAppDispatch,
  setIsFirstPageLoading,
} from "@/shared/model/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export const RedirectOnReload = () => {
  const isFirstPageLoading = useAppSelector(
    (state) => state.ui.isFirstPageLoading
  );
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isFirstPageLoading) {
      if (pathname !== "/") router.push("/");
      dispatch(setIsFirstPageLoading(false));
    }
  }, []);
  return <></>;
};
