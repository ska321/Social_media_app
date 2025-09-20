import db from "@/lib/db";
import { Post } from "@/lib/models";
import { getUserFromCookie } from "@/lib/auth";

export async function POST(req) {
  await db;
  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { postId, text } = await req.json();
  const post = await Post.findById(postId);
  if (!post) return new Response("Post not found", { status: 404 });

  post.comments.push({ userId: user.id, text });
  await post.save();

  const populatedPost = await post.populate("userId", "username").populate("comments.userId", "username");

  return new Response(JSON.stringify(populatedPost), { status: 200 });
}
