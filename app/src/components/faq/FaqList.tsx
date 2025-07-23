"use client";
import { Faq } from "@/redux/api/types";
import React, { useEffect } from "react";
import DropdownTrigger from "../home/DropdownTrigger";
import ExpandableElement from "../home/ExpandableElement";
import { typograf } from "@/helpers/typograf";
import { useAppDispatch } from "@/redux/hooks";
import { setPageName } from "@/redux/slices/uiSlice";

type Props = {
  faqs: Faq[];
};

export default function FaqList({ faqs }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageName("FAQ"));
  }, []);

  return (
    <div className="flex flex-col gap-[20px] mt-20">
      {faqs.map((question, index) => (
        <ExpandableElement
          key={index}
          triggerRender={({ onClick, isOpen }) => (
            <DropdownTrigger
              className="[&]:justify-between px-[20px] [&]:text-left [&]:py-[15px]"
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
