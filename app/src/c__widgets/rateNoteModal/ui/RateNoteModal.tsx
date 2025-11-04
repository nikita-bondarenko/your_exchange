import { useCallSupport } from "@/d__features/support/lib";
import { setHasRateNoteOpenedOnce, useAppDispatch, useAppSelector } from "@/shared/model/store";
import BaseModal from "@/shared/ui/modal/BaseModal";
import { useEffect, useRef, useState } from "react";

const RateNoteModal = () => {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(0);

  const hasRateNoteOpenedOnce = useAppSelector(
    (state) => state.ui.hasRateNoteOpenedOnce
  );

  const dispatch = useAppDispatch();

  const { callSupport } = useCallSupport();

  const supportLinkHandler: React.MouseEventHandler = (e) => {
    e.preventDefault();
    callSupport();
  };

  const modalElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasRateNoteOpenedOnce)
      setTimeout(() => {
        setIsNoteModalOpen(true);
        dispatch(setHasRateNoteOpenedOnce(true))
      }, 1000);
  }, [modalElement]);

  useEffect(() => {
    setRenderTrigger((prev) => prev + 1);
  }, []);

  return (
    <BaseModal
      ref={modalElement}
      renderTrigger={renderTrigger}
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

export default RateNoteModal;
