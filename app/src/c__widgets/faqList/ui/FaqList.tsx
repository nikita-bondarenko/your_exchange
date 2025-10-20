"use client";
import { Faq } from "@/shared/api/types";
import React, { useEffect } from "react";
import DropdownTrigger from "../../../shared/ui/dropdown/DropdownTrigger";
import ExpandableElement from "../../../shared/ui/dropdown/ExpandableElement";
import { typograf } from "@/shared/lib/string/typograf";
import { useAppDispatch } from "@/shared/model/store/hooks";
import { setPageName } from "@/shared/model/store/reducers/uiReducer";
import { useFaqsListQuery } from "@/shared/api/cryptusApi";


export default function FaqList() {
  const dispatch = useAppDispatch();

  const {data} = useFaqsListQuery()

  useEffect(() => {
    dispatch(setPageName("Нас часто спрашивают"));
  }, []);

  return (
    <div className="flex flex-col gap-[20px] mt-20">
      {data && data[0]?.faqs?.map((question, index) => (
        <ExpandableElement
          key={index}
          triggerRender={({ onClick, isOpen }) => (
            <DropdownTrigger
              className="[&]:justify-between px-[20px] [&]:text-left [&]:py-[15px] [&]:h-auto [&]:min-h-[50px] [&]:gap-30"
              onClick={onClick}
              arrowPosition={isOpen ? "bottom" : "top"}
              arrow
            >
              {question.title}
            </DropdownTrigger>
          )}
        >
          <p
            className="answer"
            dangerouslySetInnerHTML={{ __html: typograf(question.description) }}
          ></p>{" "}
        </ExpandableElement>
      ))}
    </div>
  );
}
