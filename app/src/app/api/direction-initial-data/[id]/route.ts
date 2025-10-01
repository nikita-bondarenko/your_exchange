
import { NextRequest, NextResponse } from "next/server";
import { provideFetchWithAuth } from "@/helpers/provideAuth";

export async function GET(request: NextRequest) {
    console.log(request)
  try {
    return NextResponse.json(await provideFetchWithAuth(request));
  } catch (error) {
    return NextResponse.json(error)
  }
}
