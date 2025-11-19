"use client";
import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/model/store/hooks";
import { useGlobalLoading } from "./lib";
import { setIsLoading } from "@/shared/model/store";

export const LoadingProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading } = useGlobalLoading();
  return <div className={clsx("shimmer-on-loading flex-grow",{"loading":isLoading})}>{children}</div>;
};

LoadingProvider.displayName = "LoadingProvider";

