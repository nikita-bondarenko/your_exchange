"use client";
import { Icon } from "@/shared/ui/media";
import Button from "@/shared/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Notification } from "@/shared/ui/form/Notification";
import {
  useAppDispatch,
  useAppSelector,
  setUserId,
  clearAll,
  setSelectedCurrencyBuyType,
  setSelectedCurrencySellType,
} from "@/shared/model/store";

export default function ExchangeResultPage() {
  const [copied, setCopied] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const exchangeId = useAppSelector((state) => state.ui.exchangeId);
  const userId = useAppSelector((state) => state.user.id);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exchangeId?.toString() || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoChat = () => {
    window.Telegram?.WebApp.close();
  };

  const updateUserData = () => {
    if (userId) dispatch(setUserId(userId));
  };

  useEffect(() => {
    dispatch(clearAll());
    dispatch(setSelectedCurrencySellType("COIN"));
    dispatch(setSelectedCurrencyBuyType("BANK"));

    return () => {
      updateUserData();
    };
  }, []);

  return (
    <div className="container h-full  ">
      <div className="w-full mx-auto flex flex-col h-full justify-between">
        <div className="bg-[#FFFFFF] rounded-6 border-1 border-[#FFFFFF] px-26 pt-32 pb-25 flex flex-col items-center mb-30">
          <Icon src="clock.svg" className="w-40 h-40 mb-18" />
          <div className="text-17 font-medium mb-8 text-center text-black">
            Ваша заявка <br />
            принята в работу
          </div>
          <div className="text-16 text-[#BFBFBF] mb-18 text-center leading-[120%]">
            Наш оператор свяжется <br />с вами в течение 15 минут
            <br /> <br />
            Заранее информируем вас о&nbsp;том, что среднее время обмена сейчас
            составляет до&nbsp;180 минут, в&nbsp;связи с&nbsp;волатильностью
            рынка и&nbsp;техническими сложностями в&nbsp;переводах
          </div>
          <div className="w-full h-1 bg-[#BFBFBF] mt-5 mb-13"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-16 text-[#BFBFBF]">номер заявки</div>
            <div className="flex items-center gap-7">
              <button
                onClick={handleCopy}
                className="p-1 flex items-center gap-7"
              >
                <Icon src={"copy.svg"} className="w-15 h-15 translate-y-1" />
                <span className="text-16 font-medium text-[#BFBFBF] select-all">
                  {exchangeId?.toString() || ""}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-grow gap-32 justify-between">
          <Notification
            isVisible={copied}
            message="номер заявки скопирован"
            iconSrc="sign.svg"
          />
          <div className="flex flex-col gap-12">
            <Button
              onClick={handleGoChat}
              type="primary"
              className="w-full text-15 py-15"
            >
              В чат с оператором
            </Button>
            <Button
              onClick={handleGoHome}
              type="bordary"
              className="w-full text-15 py-15"
            >
              В главное меню
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
