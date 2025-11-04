// GET /api/transfer-abroad/currencies/:transfer_option_id
import { NextResponse } from "next/server";

const currenciesByOption: Record<number, any[]> = {
  1: [
    { id: 1, name: "USD", icon: "/images/icons/crypt.svg", limit: 50000 },
    { id: 2, name: "EUR", icon: "/images/icons/crypt.svg", limit: 45000 },
    { id: 3, name: "CNY", icon: "/images/icons/crypt.svg", limit: null },
  ],
  2: [{ id: 3, name: "CNY", icon: "/images/icons/crypt.svg", limit: 1000000 }],
  3: [
    { id: 1, name: "USD", icon: "/images/icons/crypt.svg", limit: null },
    { id: 2, name: "EUR", icon: "/images/icons/crypt.svg", limit: null },
  ],
  4: [
    { id: 1, name: "USD", icon: "/images/icons/crypt.svg", limit: null },
    { id: 4, name: "GBP", icon: "/images/icons/crypt.svg", limit: 30000 },
  ],
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ transfer_option_id: string }> }
) {
  const optionId = (await params).transfer_option_id;
  const id = parseInt(optionId);
  const currencies = currenciesByOption[1] || [];

  return NextResponse.json({ currencies });
}
