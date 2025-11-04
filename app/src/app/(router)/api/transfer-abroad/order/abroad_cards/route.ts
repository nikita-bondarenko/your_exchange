import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const body = await request.json();
  const { currency_name, amount, bank_name, card_number } = body;

  if (!currency_name || !amount || !bank_name || !card_number) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  return NextResponse.json({ order_id: uuidv4().slice(0,5) });
}