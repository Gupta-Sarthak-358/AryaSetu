import { logout, assertSameOrigin, errorResponse } from "@/lib/server/auth";

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    await logout();
    return Response.json({ ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
