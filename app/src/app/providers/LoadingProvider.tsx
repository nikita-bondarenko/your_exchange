"use client";
import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import { useGlobalLoading } from "@/shared/lib/fetching/useGlobalLoading";
import { useAppDispatch, useAppSelector } from "@/shared/model/store/hooks";
import { setIsLoading } from "@/shared/model/store/slices/uiSlice";

export const LoadingProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading } = useGlobalLoading();
    const isInitLoading = useAppSelector((state) => state.ui.isLoading);
    const dispatch = useAppDispatch();
    
  useEffect(() => {
    if (isLoading) {
        dispatch(setIsLoading(false))
    }
  }, [isLoading]);

  return <div className={clsx("shimmer-on-loading flex-grow",{"loading":isLoading || isInitLoading})}>{children}</div>;
};

LoadingProvider.displayName = "LoadingProvider";

