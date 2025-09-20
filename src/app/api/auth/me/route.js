import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  const user = await getUserFromCookie(); // ✅ must await now
  if (!user) return new Response("Unauthorized", { status: 401 });

  return new Response(JSON.stringify(user), { status: 200 });
}
