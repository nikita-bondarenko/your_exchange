import { setIsNextPageAvailable, useAppDispatch } from "@/shared/model/store";
import { useEffect } from "react";

export const useLockNextPage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setIsNextPageAvailable(false));
  }, []);
};
