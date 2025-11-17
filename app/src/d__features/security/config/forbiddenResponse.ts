'use server'
import { NextResponse } from "next/server";

export const forbiddenResponse = new NextResponse(
      JSON.stringify({ error: "Forbidden: invalid request source" }),
      {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    )