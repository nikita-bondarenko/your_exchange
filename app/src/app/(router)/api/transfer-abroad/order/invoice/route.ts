import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const body = await request.json();
  const { transfer_type, currency_name, amount, country_name, task_description } = body;

  if (!transfer_type || !currency_name || !amount || !country_name || !task_description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  return NextResponse.json({ order_id: uuidv4() });
}