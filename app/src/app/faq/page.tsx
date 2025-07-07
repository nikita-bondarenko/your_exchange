import FaqList from "@/components/faq/FaqList";
import DropdownTrigger from "@/components/home/DropdownTrigger";
import ExpandableElement from "@/components/home/ExpandableElement";
import { API_URL } from "@/config";
import { FaqsListApiResponse } from "@/redux/api/types";
import React from "react";

async function getFaqs() {
  const res = await fetch(API_URL + "/faqs", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch FAQs");
  return res.json();
}

export default async function Page() {
  const [{ faqs }] = (await getFaqs()) as FaqsListApiResponse;

  return (
    <div className="container ">
      <FaqList faqs={faqs}></FaqList>
    </div>
  );
}
