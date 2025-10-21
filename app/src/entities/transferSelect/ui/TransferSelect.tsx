import { memo, useState } from "react";
import { TransferSelectItem, TransferType } from "./TransferSelectItem";

const transferTypes: TransferType[] = [
  {
    id: 1,
    icon: "/images/icons/card.svg",
    name: "Пополнение зарубежных карт",
    description:
      "Пополнение иностранных карт и финтех-счетов (Wise, Revolut, Zelle и др.) напрямую и без сложностей. Заранее согласуем сумму, сроки и остальные детали. Лимитв рамках одного пополнения — до 9,999€",
  },
  {
    id: 2,
    icon: "/images/icons/cash.svg",
    name: "Alipay и WeChat",
    description:
      "Оперативное пополнение Alipay и WeChat — быстро, надёжно и с гарантией зачисления.",
  },
  {
    id: 3,
    icon: "/images/icons/car.svg",
    name: "Оплата по инвойсу",
    description:
      "Быстрые и безопасные международные платежи по SWIFT/SEPA: проверим реквизиты, согласуем сроки и оплатим авто, недвижимость, услуги и другие покупки.",
  },
];

export const TransferSelect = memo(() => {
  const [selectedTypeId, setSelectedTypeId] = useState(1);
  return (
    <div className="overflow-hidden rounded-6 bg-[var(--background-secondary)] border border-[var(--border-placeholder)]">
      {transferTypes.map((type) => (
        <TransferSelectItem
          key={type.id}
          {...type}
          isSelected={type.id === selectedTypeId}
          onClick={() => setSelectedTypeId(type.id)}
        ></TransferSelectItem>
      ))}
    </div>
  );
});

TransferSelect.displayName = "TransferSelect";
