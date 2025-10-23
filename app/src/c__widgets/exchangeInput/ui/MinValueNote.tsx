import { useCallSupport } from "@/d__features/support/lib";

export const MinValueNote = () => {
  const { callSupport } = useCallSupport();

  const handleMinValueDescriptionClick: React.MouseEventHandler = () => {
    callSupport();
  };
  return (
    <>
      {" "}
      <p className="text-[var(--text-main)] mb-[5px] text-[14px]">
        Минимальная сумма обмена может быть ниже
      </p>
      <button
        onClick={handleMinValueDescriptionClick}
        className="text-[var(--text-secondary)] text-[13px]"
      >
        Уточните подробности у оператора
      </button>
    </>
  );
};
