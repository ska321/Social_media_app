import mongoose from "mongoose";

/* ----------------------- COMMENT SCHEMA ----------------------- */
const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

/* ------------------------ POST SCHEMA ------------------------- */
const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // post must have an author
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [], // 🔥 FIX — ensures likes array ALWAYS exists
    },

    comments: {
      type: [CommentSchema],
      default: [], // ensure empty array instead of undefined
    },
  },
  { timestamps: true }
);

/* ------------------------- USER SCHEMA ------------------------ */
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/* -------------------------- EXPORTS --------------------------- */
export const Post =
  mongoose.models.Post || mongoose.model("Post", PostSchema);

export const User =
  mongoose.models.User || mongoose.model("User", UserSchema);
