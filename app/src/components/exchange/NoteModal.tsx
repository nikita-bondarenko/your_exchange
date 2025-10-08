import { useCallSupport } from "@/hooks/useCallSupport";
import BaseModal from "../ui/BaseModal";
import {  useEffect, useRef, useState } from "react";

const NoteModal = () => {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(0);

  const { callSupport } = useCallSupport();

  const supportLinkHandler: React.MouseEventHandler = (e) => {
    e.preventDefault();
    callSupport();
  };

  const modalElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsNoteModalOpen(true);
    }, 1000);
  }, [modalElement]);

  useEffect(() => {
    setRenderTrigger((prev) => prev + 1);
  }, []);

  return (
    <BaseModal
      ref={modalElement}
      renderTrigger={renderTrigger}
      mode="light"
      isOpen={isNoteModalOpen}
      handleClose={() => setIsNoteModalOpen(false)}
    >
      Напоминаем вам о&nbsp;том, что курс зависит от&nbsp;
      <strong className="font-semibold">волатильности рынка</strong> и&nbsp;
      <strong className="font-semibold">суммы обмена</strong>&nbsp;&mdash; чем
      больше сумма, тем <strong className="font-semibold">выгоднее курс</strong>
      <br /> <br />
      Если сумма ниже минимального порога,{" "}
      <a
        onClick={supportLinkHandler}
        className="underline underline-offset-3 font-semibold"
        href="#"
      >
        обратитесь к&nbsp;нашим операторам
      </a>
      , и&nbsp;они помогут провести обмен.
    </BaseModal>
  );
};

export default NoteModal;
