"use client";

import ProfileButton from "@/entities/profileButton/ui/ProfileButton";
import ExpandableList from "@/shared/ui/dropdown/ExpandableList";
import Button from "@/shared/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/model/store";
import { POLICY_URL, TERMS_URL } from "@/shared/config";
import dynamic from "next/dynamic";
import { useGetCurrenciesGetQuery } from "@/shared/api";
import { useCallSupport } from "@/d__features/support/lib";
import DescriptionItem from "./descriptionItem/DescriptionItem";
import EmailModal from "@/c__widgets/emailmodal/ui";
import AgreementModal from "@/c__widgets/agreementModal/ui";
const RequestStatus = dynamic(() => import("@/entities/requestStatus/ui/RequestStatus"), {
  ssr: false,
});
export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { callSupport } = useCallSupport();

  const requestsInProcess = useAppSelector(
    (state) => state.user.data?.requests_in_process
  );
  const profilePicture = useAppSelector(
    (state) => state.user.data?.user_data?.profile_picture
  );
  const [forceRender, setForceRender] = useState(0);

  const { data } = useGetCurrenciesGetQuery({
    currencyType: "BANK",
    giveCurrencyId: 4,
  });


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
      text: "Профиль",
      onClick: toProfilePage,
    },
    {
      text: "Нас часто спрашивают",
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
  ]);

  const descriptionItems = useRef([
    {
      icon: "home.svg",
      text: "Наличные в офисе",
      className: "w-[15px] h-[15px]",
    },
    {
      icon: "car.svg",
      text: "Курьерские доставки",
      className: "w-[20px] h-[12px]",
    },
    { icon: "planet.svg", text: "ВЭД", className: "w-[16px] h-[16px]" },
  ]);

  return (
    <>
      <div className="container h-full flex flex-col">
        <div className="rounded-6 px-20 pt-35 pb-28 mb-17 flex-grow flex flex-col bg-white relative overflow-hidden">
          <div className="absolute bottom-[70px] translate-y-[10%] right-[3%] translate-x-1/2 w-[217%] aspect-square  bg-contain"></div>
          <div className="flex-grow flex flex-col justify-center relative z-10">
            <div className="flex justify-between">
              <div className="max-w-205">
                <h1 className="font-bold text-black text-32 mb-15 leading-normal">
                  Test Change
                </h1>
                <p className="text-16 font-medium mb-30 text-[#505050] ">
                  Покупка и&nbsp;продажа <br />
                  криптовалюты <br />
                  по&nbsp;выгодному курсу
                </p>
              </div>
              <ProfileButton
                key={forceRender}
                avatar={profilePicture}
                onClick={toProfilePage}
              />
            </div>

            <ul className="flex flex-col gap-11 mb-16">
              {descriptionItems.current.map((item, index) => (
                <DescriptionItem
                  icon={item.icon}
                  key={index}
                  className={item.className}
                >
                  {item.text}
                </DescriptionItem>
              ))}
            </ul>
            <div className="min-h-60 flex flex-col gap-11  mb-20">
              {requestsInProcess?.map((request) => (
                <RequestStatus
                  isInProcess={true}
                  id={request.id || ""}
                  key={request.id}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 z-10">
            <Button
              onClick={toExchangePage}
              className="home-btn"
              type={"primary"}
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
      <EmailModal/>
      <AgreementModal/>
    </>
  );
}
