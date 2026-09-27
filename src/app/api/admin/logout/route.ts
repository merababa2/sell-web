import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST() {
  const h = await headers();
  const auth = h.get("authorization");
  
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7).trim();
    await destroySession(token);
  }
  
  return NextResponse.json({ ok: true });
}
