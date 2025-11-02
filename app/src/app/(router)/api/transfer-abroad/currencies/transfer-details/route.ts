// GET /api/transfer-abroad/currencies/transfer-details?currency_id=&transfer_option_id=
import { NextResponse } from 'next/server';

const subOptions = {
  banks: [
    { id: 1, name: 'Bank of America' },
    { id: 2, name: 'HSBC' },
    { id: 3, name: 'Deutsche Bank' },
  ],
  platforms: [
    { id: 1, name: 'Alipay' },
    { id: 2, name: 'WeChat Pay' },
    { id: 3, name: 'UnionPay' },
  ],
  countries: [
    { id: 1, name: 'USA' },
    { id: 2, name: 'Germany' },
    { id: 3, name: 'China' },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currency_id = searchParams.get('currency_id');
  const transfer_option_id = searchParams.get('transfer_option_id');

  if (!currency_id || !transfer_option_id) {
    return NextResponse.json(
      { error: 'currency_id and transfer_option_id are required' },
      { status: 400 }
    );
  }

  const optionId = parseInt(transfer_option_id);
  const response: any = {};

  if (optionId === 3) {
    response.banks = subOptions.banks;
  } else if (optionId === 4) {
    response.platforms = subOptions.platforms;
  } else if (optionId === 5 || optionId === 2) {
    response.countries = subOptions.countries;
  }

  return NextResponse.json(response);
}