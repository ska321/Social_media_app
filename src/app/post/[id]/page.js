"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";

export default function PostPage() {
  const params = useParams();
  const { id } = params;
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [commentText, setCommentText] = useState("");

  // Load current user
  async function loadUser() {
    const res = await fetch("/api/auth/me");
    if (res.ok) setUser(await res.json());
  }

  // Load the post
  async function loadPost() {
    const res = await fetch(`/api/posts/${id}`);
    const data = await res.json();
    setPost(data);
  }

  useEffect(() => {
    loadUser();
    loadPost();
  }, []);

  // Like/unlike post
  async function handleLike() {
    if (!user) return;
    await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post._id }),
    });
    loadPost();
  }

  // Add comment
  async function handleComment() {
    if (!commentText || !user) return;
    await fetch("/api/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post._id, text: commentText }),
    });
    setCommentText("");
    loadPost();
  }

  if (!post) return <p className="text-center mt-10">Loading...</p>;

  const likesArray = post.likes || [];
  const likedByUser = likesArray.some(
    (id) => id === user?.id || id === user?.id?.toString()
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 space-y-4">
        {/* Post Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {post.userId?.username?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              {post.userId?.username || "Unknown"}
            </p>
            <p className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-gray-700 dark:text-gray-200 text-base">{post.content}</p>

        {/* Action Bar (LinkedIn style) */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-2 text-gray-600 dark:text-gray-300 text-sm font-medium">
          <button
            className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
              likedByUser ? "text-blue-500" : ""
            }`}
            onClick={handleLike}
          >
            <ThumbsUp size={18} />
            {likedByUser ? "Liked" : "Like"}{" "}
            {likesArray.length > 0 && `(${likesArray.length})`}
          </button>

          <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <MessageCircle size={18} /> Comment{" "}
            {post.comments?.length > 0 && `(${post.comments.length})`}
          </button>

          <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Share2 size={18} /> Share
          </button>
        </div>

        {/* Add Comment */}
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleComment();
            }}
          />
          <button
            onClick={handleComment}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-colors"
          >
            Comment
          </button>
        </div>

        {/* Comments List */}
        <div className="mt-4 space-y-2">
          {post.comments?.length > 0 ? (
            post.comments.map((c, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                  {c.userId?.username?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    {c.userId?.username || "Unknown"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">{c.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
