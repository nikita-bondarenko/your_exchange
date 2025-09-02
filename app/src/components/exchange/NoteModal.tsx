import BaseModal from "../ui/BaseModal";
import { useEffect, useState } from "react";

const NoteModal = () => {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsNoteModalOpen(true);
    }, 1000);
  }, []);

  return (
    <BaseModal
      mode="light"
      isOpen={isNoteModalOpen}
      handleClose={() => setIsNoteModalOpen(false)}
    >
      Напоминаем вам о&nbsp;том, что курс зависит как от&nbsp;
      <strong className="font-semibold">волатильности рынка</strong>, так
      и&nbsp;от&nbsp;
      <strong className="font-semibold">общей суммы обмена</strong>.
      <br /> <br />
      Чем сумма обмена больше, тем&nbsp;
      <strong className="font-semibold">более выгодный курс</strong>{" "}
      относительно рынка мы сможем вам предложить.
    </BaseModal>
  );
};

export default NoteModal;
