import db from "@/lib/db";
import { User } from "@/lib/models";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(req) {
  await db;
  const { username, password } = await req.json();

  const user = await User.findOne({ username });
  if (!user) return new Response("Invalid credentials", { status: 401 });

  if (user.password !== password) {
    return new Response("Invalid credentials", { status: 401 });
  }

  const token = createToken(user);
  await setAuthCookie(token); // ✅ must await now

  return new Response(JSON.stringify({ id: user._id, username }), {
    status: 200,
  });
}
