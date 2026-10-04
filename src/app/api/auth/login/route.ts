import { login } from "@/lib/server/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ error: "email and password required" }, { status: 400 });
    }
    const result = await login(String(email), String(password));
    if (!result.ok) return Response.json({ error: result.error }, { status: 401 });
    return Response.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
