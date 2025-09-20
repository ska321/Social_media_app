import db from "@/lib/db";
import { User } from "@/lib/models";

export async function POST(req) {
  await db;
  const { username, password } = await req.json();
  if (!username || !password)
    return new Response("Missing fields", { status: 400 });

  const existing = await User.findOne({ username });
  if (existing) return new Response("User exists", { status: 400 });

  // Store password as plain text
  const user = await User.create({ username, password });

  return new Response(JSON.stringify({ id: user._id, username }), {
    status: 201,
  });
}
