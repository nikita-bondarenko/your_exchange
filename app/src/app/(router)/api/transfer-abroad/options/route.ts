// GET /api/transfer-abroad/options
import { NextResponse } from "next/server";

const transferOptions = {
  individual: [
    {
      id: 3,
      icon: "/images/icons/card.svg",
      name: "Пополнение зарубежных карт",
      description:
        "Пополнение иностранных карт и финтех-счетов (Wise, Revolut, Zelle и др.) напрямую и без сложностей. Заранее согласуем сумму, сроки и остальные детали. Лимитв рамках одного пополнения — до 9,999€",
    },
    {
      id: 4,
      icon: "/images/icons/add-comment.svg",
      name: "Alipay и WeChat",
      description:
        "Оперативное пополнение Alipay и WeChat — быстро, надёжно и с гарантией зачисления.",
    },
    {
      id: 5,
      icon: "/images/icons/blank.svg",
      name: "Оплата по инвойсу",
      description:
        "Быстрые и безопасные международные платежи по SWIFT/SEPA: проверим реквизиты, согласуем сроки и оплатим авто, недвижимость, услуги и другие покупки.",
    },
  ],
  legal_entity: [
    {
      id: 1,
      icon: "/images/icons/captive-portal.svg",
      name: "Платежный агент/ВЭД",
      description:
        "Выступим платёжным агентом для вашего бизнеса: оплачиваем зарубежные инвойсы с российских счетов, возвращаем экспортную выручку и помогаем со сбором всех необходимых документов.",
    },
    {
      id: 2,
      icon: "/images/icons/blank.svg",
      name: "Оплата по инвойсу",
      description:
        "Платежи по вашим зарубежным инвойсам через SWIFT и SEPA: мы берём на себя проверку реквизитов, контроль сроков и безопасную отправку средств вашим партнёрам в любой точке мира — без лишней бюрократии и с полным контролем всех этапов.",
    },
  ],
};

export async function GET() {
  return NextResponse.json(transferOptions);
}
