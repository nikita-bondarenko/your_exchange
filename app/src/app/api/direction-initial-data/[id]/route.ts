
import { NextRequest, NextResponse } from "next/server";
import { provideFetchWithAuth } from "@/helpers/provideAuth";
import { isAllowedOrigin } from "@/helpers/isAllowedOrigin";

export async function GET(request: NextRequest) {
  if (isAllowedOrigin(request)) {
    try {
      return NextResponse.json(await provideFetchWithAuth(request));
    } catch (error) {
      return NextResponse.json(error);
    }
  } else {
    return NextResponse.json(
      {
        error: {
          message: `Not Allowed`,
          type: "cors",
        },
      },
      { status: 403 }
    );
  }
}
