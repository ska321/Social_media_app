import db from "@/lib/db";
import { Post } from "@/lib/models";

export async function GET(req, { params }) {
  await db;

  const { id } = params;

  try {
    const post = await Post.findById(id)
      .populate("userId", "username")
      .populate("comments.userId", "username");

    if (!post) return new Response("Post not found", { status: 404 });

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response("Invalid post ID", { status: 400 });
  }
}
