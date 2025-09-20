import db from "@/lib/db";
import { Post } from "@/lib/models";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  await db;

  // populate user for posts and comments
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("userId", "username")            // post author
    .populate("comments.userId", "username"); // comment author

  return new Response(JSON.stringify(posts), { status: 200 });
}

export async function POST(req) {
  await db;
  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { content } = await req.json();

  const post = await Post.create({ userId: user.id, content });

  // populate immediately after creation for consistent response
  const populatedPost = await post.populate("userId", "username");

  return new Response(JSON.stringify(populatedPost), { status: 201 });
}
