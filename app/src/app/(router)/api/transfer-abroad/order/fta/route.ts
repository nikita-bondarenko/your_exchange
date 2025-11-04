import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const formData = await request.formData();
  const currency_name = formData.get('currency_name') as string;
  const amount = formData.get('amount') as string;
  const task_description = formData.get('task_description') as string;

  if (!currency_name || !amount || !task_description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  return NextResponse.json({ order_id: uuidv4().slice(0,5) });
}