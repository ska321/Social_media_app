import db from "@/lib/db";
import { Post } from "@/lib/models";
import { getUserFromCookie } from "@/lib/auth";

export async function POST(req) {
  await db;

  const user = await getUserFromCookie();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { postId } = await req.json();
  const post = await Post.findById(postId);

  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  // Ensure likes array exists
  if (!Array.isArray(post.likes)) {
    post.likes = [];
  }

  const userIdStr = user.id.toString();
  const index = post.likes.findIndex((id) => id.toString() === userIdStr);

  if (index === -1) {
    post.likes.push(user.id); // like
  } else {
    post.likes.splice(index, 1); // unlike
  }

  await post.save();

  // Populate user + comments
  await post.populate("userId", "username");
  await post.populate("comments.userId", "username");

  return new Response(JSON.stringify(post), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
