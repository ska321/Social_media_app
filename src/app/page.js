"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, MessageSquare } from "lucide-react";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const router = useRouter();

  async function loadUser() {
    const res = await fetch("/api/auth/me");
    if (res.ok) setUser(await res.json());
    else router.push("/login");
  }

  async function loadPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  }

  useEffect(() => {
    loadUser();
    loadPosts();
  }, []);

  async function handlePost() {
    if (!content) return;
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setContent("");
    loadPosts();
  }

  async function handleLike(postId) {
    await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    loadPosts();
  }

  async function handleShare(postId) {
    await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    loadPosts();
  }

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <header className="bg-blue-300 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className=" text-black text-2xl px-2 py-1 rounded-sm">
              FyPOST
            </span>
          </div>

          <div className="flex-1 max-w-md mx-6 relative">
            <Search className="absolute left-3 top-2.5 text-black" size={18} />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-3 py-2 rounded-full text-sm text-black focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="text-black flex flex-col items-center cursor-pointer hover:text-gray-500">
              <Home size={20} /> <span className="hidden sm:block">Home</span>
            </div>
            <div className="text-black flex flex-col items-center cursor-pointer hover:text-gray-500">
              <MessageSquare size={20} /> <span className="hidden sm:block">Messaging</span>
            </div>

            <div
              className="w-8 h-8 rounded-full bg-white text-blue-500 flex items-center justify-center font-bold cursor-pointer"
              onClick={() => setShowLogoutPopup(true)}
              title="Logout"
            >
              {user.username[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center space-y-4 w-80">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Logout Confirmation
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  router.push("/login");
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-black dark:text-white"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {user.username}
                </h2>
                <p className="text-gray-500 text-sm">@{user.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          {/* Create Post */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <input
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start a post"
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full transition"
                onClick={handlePost}
              >
                Post
              </button>
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-4">
            {posts.map((post) => {
              const likesArray = post.likes || [];
              const likedByUser = likesArray.some(
                (id) => id === user.id || id === user.id.toString()
              );
              const commentsArray = post.comments || [];
              const sharesArray = post.shares || []; // assuming `shares` array in post

              const latestComment = commentsArray.length > 0 ? commentsArray[commentsArray.length - 1] : null;

              return (
                <div
                  key={post._id}
                  className="bg-white dark:bg-gray-800 shadow rounded-2xl p-4 space-y-3 transition hover:shadow-md cursor-pointer"
                  onClick={() => router.push(`/post/${post._id}`)}
                >
                  {/* Post Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {post.userId?.username?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {post.userId?.username || "Unknown"}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-700 dark:text-gray-300 text-base">
                    {post.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500">
                    <button
                      className={`flex items-center gap-1 ${
                        likedByUser
                          ? "text-blue-500"
                          : "hover:text-blue-600 text-gray-600"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post._id);
                      }}
                    >
                      👍 {likesArray.length}
                    </button>
                    <span className="cursor-pointer hover:text-blue-600">
                      💬 {commentsArray.length}
                    </span>
                    <span
                      className="cursor-pointer hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(post._id);
                      }}
                    >
                      🔗 {sharesArray.length}
                    </span>
                  </div>

                  {/* Latest Comment */}
                  {latestComment && (
                    <div className="mt-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                      <b>{latestComment.userId?.username || "Unknown"}:</b>{" "}
                      {latestComment.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
