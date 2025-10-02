
import { NextRequest, NextResponse } from "next/server";
import { provideFetchWithAuth } from "@/helpers/provideAuth";


export async function POST(request: NextRequest) {
  try {
      return NextResponse.json(await provideFetchWithAuth(request));
    } catch (error) {
      return NextResponse.json(error);
    }
}
