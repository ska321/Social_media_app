import mongoose from "mongoose";

// Comment Schema
const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

// Post Schema
const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // post author
  content: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // array of user IDs
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
});

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String, // plain text since bcrypt removed
});

// Export models
export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
