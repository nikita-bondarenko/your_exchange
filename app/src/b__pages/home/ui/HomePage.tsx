"use client";

import ProfileButton from "@/entities/profileButton/ui/ProfileButton";
import ExpandableList from "@/shared/ui/dropdown/ExpandableList";
import { Button } from "@/shared/ui/button";
import { createRef, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/model/store";
import { useCallSupport } from "@/d__features/support/lib";
import DescriptionItem from "./descriptionItem/DescriptionItem";
import EmailModal from "@/c__widgets/emailmodal/ui";
import AgreementModal from "@/c__widgets/agreementModal/ui";
import { useAdditionalSectionList } from "../lib";
import RequestStatus from "@/entities/requestStatus/ui";
import { ModeSwitcher } from "@/d__features/modeSwitcher/ui";
import clsx from "clsx";
import { PROJECT_DATA } from "@/shared/config";

export default function HomePage() {
  const { callSupport } = useCallSupport();
  const router = useRouter();

  const requestsInProcess = useAppSelector(
    (state) => state.user.data?.requests_in_process
  );
  const profilePicture = useAppSelector(
    (state) => state.user.data?.user_data?.profile_picture
  );
  const [forceRender, setForceRender] = useState(0);

  const homePageData = useAppSelector((state) => state.pageData.home);
  const isExchangeMode = useAppSelector(
    (state) => state.featuresFlags.isExchangeMode
  );
  const isTransferAbroadMode = useAppSelector(
    (state) => state.featuresFlags.isTransferAbroadMode
  );

  const handleStartButton = () => {
    const startButtonHref =
      isExchangeMode && !isTransferAbroadMode
        ? "/exchange/type"
        : "/transfer-abroad/type";
    router.push(startButtonHref);
  };

  const transferDescriptionListElement = createRef<HTMLUListElement>();
  const exchangeDescriptionListElement = createRef<HTMLUListElement>();

  const [descriptionListElementHeight, setDescriptionListElement] = useState<
    number | string
  >("auto");
  useEffect(() => {
    if (
      transferDescriptionListElement.current &&
      exchangeDescriptionListElement.current
    ) {
      const firstElementHeight =
        transferDescriptionListElement.current.clientHeight;
      const secondElementHeight =
        exchangeDescriptionListElement.current.clientHeight;
      const height = Math.max(firstElementHeight, secondElementHeight);
      setDescriptionListElement(height);
    }
  }, [
    exchangeDescriptionListElement.current,
    transferDescriptionListElement.current,
    homePageData,
  ]);

  const descriptionListExchange = useMemo(() => {
    const modeName = "exchange";
    return homePageData.descriptionList.filter(
      (item) => item.modeTypeWhenVisible === modeName
    );
  }, [homePageData]);

  const descriptionListTransfer = useMemo(() => {
    const modeName = "transfer";
    return homePageData.descriptionList.filter(
      (item) => item.modeTypeWhenVisible === modeName
    );
  }, [homePageData]);

  useEffect(() => {
    setForceRender((prev) => prev + 1);
  }, [profilePicture]);

  const { additionalSectionListItems } = useAdditionalSectionList({
    policyUrl: homePageData.policyUrl,
    termsUrl: homePageData.termsUrl,
  });

  return (
    <>
      <div className="container h-full flex flex-col">
        {PROJECT_DATA.isTransferAbroadFeature && <ModeSwitcher/>}
        <div className="h-13"></div>
        <div className="rounded-6 px-20 pt-35 pb-28 mb-17 flex-grow flex flex-col background-first-screen relative overflow-hidden">
          {homePageData.firstScreenBackgroundImage &&
            homePageData.firstScreenBackgroundImage()}
          <div className="flex-grow flex flex-col justify-center relative z-10">
            <div className="flex justify-between gap-[20px]">
              <div className="max-w-205">
                {homePageData.title.text && (
                  <h1
                    className="font-bold text-[var(--text-main-screen-title)] text-32 mb-15 leading-normal"
                    dangerouslySetInnerHTML={{
                      __html: homePageData.title.text,
                    }}
                  ></h1>
                )}
                {homePageData.title.image && (
                  <img
                    src={homePageData.title.image.src}
                    alt="logo"
                    className={homePageData.title.image.className}
                  />
                )}
                <p
                  className="text-16 font-medium mb-30 text-[var(--text-main-screen-subtitle)]"
                  dangerouslySetInnerHTML={{ __html: homePageData.subtitle }}
                ></p>
              </div>
              <ProfileButton key={forceRender} avatar={profilePicture} />
            </div>
            <div
              className="relative"
              style={{ height: descriptionListElementHeight }}
            >
              <ul
                ref={exchangeDescriptionListElement}
                className={clsx(
                  "flex flex-col gap-11 mb-16 absolute top-0 left-0 transition-opacity",
                  { "opacity-0": !isExchangeMode }
                )}
              >
                {descriptionListExchange.map((item, index) => (
                  <DescriptionItem
                    icon={item.icon({
                      color: "var(--text-main-screen-description)",
                      className: item.iconClassName,
                    })}
                    key={index}
                  >
                    {item.text}
                  </DescriptionItem>
                ))}
              </ul>
              <ul
                ref={transferDescriptionListElement}
                className={clsx(
                  "flex flex-col gap-11 mb-16 absolute top-0 left-0 transition-opacity",
                  { "opacity-0": !isTransferAbroadMode }
                )}
              >
                {descriptionListTransfer.map((item, index) => (
                  <DescriptionItem
                    icon={item.icon({
                      color: "var(--text-main-screen-description)",
                      className: item.iconClassName,
                    })}
                    key={index}
                  >
                    {item.text}
                  </DescriptionItem>
                ))}
              </ul>
            </div>
            <div className="min-h-60 flex flex-col gap-11  mb-20">
              {requestsInProcess?.map((request) => (
                <RequestStatus
                  isInProcess={true}
                  id={request.id}
                  key={request.id}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 z-10">
            <Button onClick={handleStartButton} type={"main-screen-left"}>
              {isExchangeMode ? "Начать обмен" : "Начать платеж"}
            </Button>
            <Button onClick={callSupport} type={"main-screen-right"}>
              Поддержка
            </Button>
          </div>
        </div>
        <ExpandableList
          items={additionalSectionListItems}
          title="Дополнительно"
        />
      </div>
      <EmailModal />
      <AgreementModal />
    </>
  );
}
