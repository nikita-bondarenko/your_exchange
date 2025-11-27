import { VideoModal } from "@/c__widgets/videoModal/ui";
import { ClockIcon, CopyIcon, SignIcon, Button } from "@/shared/ui";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { Notification } from "@/shared/ui/form/Notification";

type Props = {
  id: string | number | null | undefined;
  video?: string | undefined;
  children?: ReactNode;
};

export const RequestResult = ({ id, video, children }: Props) => {
  const router = useRouter();

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(id?.toString() || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoChat = () => {
    window.Telegram?.WebApp.close();
  };

  return (
    <div className="container h-full  ">
      <div className="w-full mx-auto flex flex-col h-full justify-between">
        <div className="bg-[var(--background-secondary)] rounded-6 text-[var(--text-light)] px-26 pt-32 pb-25 flex flex-col items-center mb-30">
          <ClockIcon
            color="var(--result-screen-clock)"
            className="w-40 h-40 mb-18"
          />
          <div className="text-17 font-medium mb-8 text-center text-[var(--text-main)]">
            Ваша заявка <br />
            принята в работу
          </div>
          <div className="text-16  mb-18 text-center leading-[120%]">
            Наш оператор свяжется <br />с вами в течение 15 минут
            {children}
          </div>
          <div className="w-full h-1 bg-[var(--divider-thirdary)] mt-5 mb-13"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-16 ">номер заявки</div>
            <div className="flex items-center gap-7">
              <button
                data-tracking-label="Скопировать номер заявки"
                onClick={handleCopy}
                className="p-1 flex items-center gap-7"
              >
                <CopyIcon className="w-15 h-15 translate-y-1 shrink-0" />
                <span className="text-16 font-medium  select-all">
                  {id?.toString() || ""}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-grow gap-32 justify-between">
          <Notification
            isVisible={copied}
            message="номер заявки скопирован"
            icon={<SignIcon className="w-12 h-12 translate-y-2" />}
          />
          <div className="flex flex-col gap-12">
            <Button
              trackingLabel="В чат с оператором"
              onClick={handleGoChat}
              type="primary"
              className="w-full text-15 py-15"
            >
              В чат с оператором
            </Button>
            <Button
              trackingLabel="В главное меню"
              onClick={handleGoHome}
              type="secondary"
              className="w-full text-15 py-15"
            >
              В главное меню
            </Button>
          </div>
        </div>
      </div>
      {video && <VideoModal src={video}></VideoModal>}
    </div>
  );
};
