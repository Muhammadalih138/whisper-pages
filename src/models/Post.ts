import { Schema, model, models } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: String,
    coverImage: String,
    authorId: {
      type: String,
      required: true,
    },
    authorName: String,
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Post = models.Post ?? model("Post", postSchema);
