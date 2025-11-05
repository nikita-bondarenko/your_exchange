
import { provideFetchWithAuth } from "@/d__features/apiProxy/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    // console.log(request)

  try {
      return NextResponse.json(await provideFetchWithAuth(request));
    } catch (error) {
      return NextResponse.json(error);
    }
}

export async function GET(request: NextRequest) {
  // console.log(request)

  try {
      return NextResponse.json(await provideFetchWithAuth(request));
    } catch (error) {
      return NextResponse.json(error);
    }
}

export async function OPTIONS(request: NextRequest) {
  // console.log('options')
  try {
      return NextResponse.json(await provideFetchWithAuth(request));
    } catch (error) {
      return NextResponse.json(error);
    }
}
