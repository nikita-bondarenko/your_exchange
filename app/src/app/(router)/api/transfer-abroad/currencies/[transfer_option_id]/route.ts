// GET /api/transfer-abroad/currencies/:transfer_option_id
import { NextResponse } from 'next/server';

const currenciesByOption: Record<number, any[]> = {
  1: [
    { id: 1, name: 'USD', icon: '$', limit: 50000 },
    { id: 2, name: 'EUR', icon: '€', limit: 45000 },
    { id: 3, name: 'CNY', icon: '¥', limit: null },
  ],
  2: [
    { id: 3, name: 'CNY', icon: '¥', limit: 1000000 },
  ],
  3: [
    { id: 1, name: 'USD', icon: '$', limit: null },
    { id: 2, name: 'EUR', icon: '€', limit: null },
  ],
  4: [
    { id: 1, name: 'USD', icon: '$', limit: null },
    { id: 4, name: 'GBP', icon: '£', limit: 30000 },
  ],
};

export async function GET(
  request: Request,
  { params }: { params: { transfer_option_id: string } }
) {
  const id = parseInt(params.transfer_option_id);
  const currencies = currenciesByOption[id] || [];

  return NextResponse.json({ currencies });
}