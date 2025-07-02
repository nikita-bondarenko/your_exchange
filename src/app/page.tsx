"use client";

import DescriptionItem from "@/components/home/DescriptionItem";
import ProfileButton from "@/components/home/ProfileButton";
import ExpandableList from "@/components/home/ExpandableList";
import Button from "@/components/ui/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { POLICY_URL, TEST_USER_ID } from "@/config";
import { useCallSupport } from "@/hooks/useCallSupport";
import { TERMS_URL } from "@/config";
import dynamic from "next/dynamic";
const RequestStatus = dynamic(() => import("@/components/home/RequestStatus"), {
  ssr: false,
});
export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { callSupport } = useCallSupport();

  const requestsInProcess = useAppSelector(
    (state) => state.user.data?.requests_in_process || []
  );
  const profilePicture = useAppSelector(
    (state) => state.user.data?.user_data?.profile_picture
  );
  const [forceRender, setForceRender] = useState(0);

  useEffect(() => {
    setForceRender((prev) => prev + 1);
  }, [profilePicture]);

  const toProfilePage = useCallback(() => {
    router.push("/profile");
  }, [router]);

  const toExchangePage = useCallback(() => {
    router.push("/exchange/type");
  }, [router]);

  const toFaqPage = useCallback(() => {
    router.push("/faq");
  }, [router]);

  const openPolicy = useCallback(() => {
    window.open(POLICY_URL, "_blank");
  }, []);

  const openTerms = useCallback(() => {
    window.open(TERMS_URL, "_blank");
  }, []);

  const additionallySectionListItems = useRef([
    {
      text: "FAQ",
      onClick: toFaqPage,
    },
    {
      text: "Соглашение",
      onClick: openTerms,
    },
    {
      text: "Политика AML",
      onClick: openPolicy,
    },
    {
      text: "Профиль",
      onClick: toProfilePage,
    },
  ]);

  const descriptionItems = useRef([
    { icon: "rocket.svg", text: "Быстрый обмен" },
    { icon: "shield.svg", text: "Безопасность" },
  ]);

  return (
    <>
      <div className="container h-full flex flex-col">
        <div
          className="rounded-6 px-20 pt-35 pb-28 mb-17 flex-grow flex flex-col"
          style={{
            background: "linear-gradient(135deg, #F09810 0%, #FF902F 100%)",
          }}
        >
          <div className="flex-grow flex flex-col justify-center">
            <div className="flex justify-between">
              <div className="max-w-205">
                <h1 className="font-bold text-white text-32 mb-15 leading-normal">
                Top Exchange
                </h1>
                <p className="text-16 font-medium mb-30 text-white ">
                  Покупка и продажа криптовалюты по&nbsp;выгодному&nbsp;курсу
                </p>
              </div>
              <ProfileButton
                key={forceRender}
                avatar={profilePicture || ""}
                onClick={toProfilePage}
              />
            </div>

            <ul className="flex flex-col gap-11 mb-16">
              {descriptionItems.current.map((item, index) => (
                <DescriptionItem icon={item.icon} key={index}>
                  {item.text}
                </DescriptionItem>
              ))}
            </ul>
            <div className="min-h-60 flex flex-col gap-11  mb-20">
              {requestsInProcess.map((request) => (
                <RequestStatus
                  isInProcess={true}
                  id={request.id || ""}
                  key={request.id}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Button
              onClick={toExchangePage}
              className="home-btn"
              type={"dark"}
            >
              Начать обмен
            </Button>
            <Button
              onClick={callSupport}
              className="home-btn"
              type={"secondary"}
            >
              Поддержка
            </Button>
          </div>
        </div>
        <ExpandableList
          items={additionallySectionListItems.current}
          title="Дополнительно"
        />
      </div>
    </>
  );
}
