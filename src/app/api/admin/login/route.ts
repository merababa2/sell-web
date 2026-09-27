import { NextResponse } from "next/server";
import { checkCredentials, createSession } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!checkCredentials(username, password)) {
    return NextResponse.json({ error: "Wrong username or password." }, { status: 401 });
  }

  await ensureSeed();
  const token = await createSession();

  // Return token strictly in payload, no cookies
  return NextResponse.json({ ok: true, token });
}
