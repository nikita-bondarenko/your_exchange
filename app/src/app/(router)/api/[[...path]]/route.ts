
import { provideFetchWithAuth } from "@/d__features/auth/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log('[[...path]]',request )
  try {
      return NextResponse.json(await provideFetchWithAuth(request));
    } catch (error) {
      return NextResponse.json(error);
    }
}

export async function GET(request: NextRequest) {
  console.log('[[...path]]',request )
  try {
      return NextResponse.json(await provideFetchWithAuth(request));
    } catch (error) {
      return NextResponse.json(error);
    }
}
