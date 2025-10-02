import { useCallSupport } from "@/hooks/useCallSupport";
import BaseModal from "../ui/BaseModal";
import { useEffect, useState } from "react";

const NoteModal = () => {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsNoteModalOpen(true);
    }, 1000);
  }, []);

  const { callSupport } = useCallSupport();

  const supportLinkHandler: React.MouseEventHandler = (e) => {
    e.preventDefault();
    callSupport();
  };

  return (
    <BaseModal
      mode="light"
      isOpen={isNoteModalOpen}
      handleClose={() => setIsNoteModalOpen(false)}
    >
      Напоминаем: <br />курс зависит от&nbsp;<strong className="font-semibold">волатильности рынка</strong> и&nbsp;<strong className="font-semibold">суммы обмена</strong> — чем больше
      сумма, тем <strong className="font-semibold">выгоднее курс</strong>.
      <br /> <br />
      Если сумма ниже минимального порога, <a
        onClick={supportLinkHandler}
        className="underline underline-offset-3 font-semibold"
        href="#"
      >
        обратитесь
        к&nbsp;нашим операторам
      </a>
      , и&nbsp;они помогут провести обмен.
    </BaseModal>
  );
};

export default NoteModal;
