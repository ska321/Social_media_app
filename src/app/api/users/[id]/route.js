import db from "@/lib/db";
import { User, Post, Comment } from "@/lib/models";

export async function GET(req, { params }) {
  await db;
  const { id } = params;

  try {
    // 1. Find user (exclude password)
    const user = await User.findById(id).select("-password");
    if (!user) return new Response("User not found", { status: 404 });

    // 2. Find posts by this user
    const posts = await Post.find({ userId: id })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    // 3. Find comments by this user
    const comments = await Comment.find({ userId: id })
      .populate("postId", "content")
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    // 4. Return structured response
    return new Response(
      JSON.stringify({
        user,
        posts,
        comments,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response("Invalid user ID", { status: 400 });
  }
}
