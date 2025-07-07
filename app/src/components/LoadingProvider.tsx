"use client";
import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsLoading } from "@/redux/slices/uiSlice";

export const LoadingProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading } = useGlobalLoading();
    const isInitLoading = useAppSelector((state) => state.ui.isLoading);
    const dispatch = useAppDispatch();
    
  useEffect(() => {
    if (isLoading) {
        dispatch(setIsLoading(false))
    }
  }, [isLoading]);

  useEffect(() => {
   // // console.log('isInitLoading', isInitLoading, isLoading)
  }, [isInitLoading, isLoading]);

  return <div className={clsx("shimmer-on-loading flex-grow",{"loading":isLoading || isInitLoading})}>{children}</div>;
};

LoadingProvider.displayName = "LoadingProvider";