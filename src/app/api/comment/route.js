import db from "@/lib/db";
import { Post } from "@/lib/models";
import { getUserFromCookie } from "@/lib/auth";

export async function POST(req) {
  await db;
  //add

  const user = await getUserFromCookie();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { postId, text } = await req.json();

  if (!text || text.trim() === "") {
    return new Response("Comment cannot be empty", { status: 400 });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  // Add the comment
  post.comments.push({
    userId: user.id,
    text,
  });

  await post.save();

  // Re-fetch with proper population
  const populatedPost = await Post.findById(postId)
    .populate("userId", "username")
    .populate("comments.userId", "username");

  return new Response(JSON.stringify(populatedPost), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
