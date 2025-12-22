"use client";
import clsx from "clsx";
import { FC } from "react";
import { useGlobalLoading } from "./lib";

export const LoadingProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading } = useGlobalLoading();
  return (
    <div className={clsx("shimmer-on-loading flex-grow relative",{"loading":isLoading})}>
      {children}
    </div>
  );
};

LoadingProvider.displayName = "LoadingProvider";

