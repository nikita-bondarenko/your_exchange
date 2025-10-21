"use client";

import { ModeSwitcher } from "@/d__features/modeSwitcher/ui";
import { TransferTypeSwitcher } from "@/d__features/transferTypeSwitcher/ui";
import { TransferSelect } from "@/entities/transferSelect/ui";
import clsx from "clsx";
import { useState } from "react";

export default function Page() {

  return (
    <div className=" flex flex-col gap-[50px] container">
      <ModeSwitcher></ModeSwitcher>
      <TransferTypeSwitcher></TransferTypeSwitcher>
      <TransferSelect></TransferSelect>
    </div>
  );
}
