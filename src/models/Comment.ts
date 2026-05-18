import { Schema, model, models } from "mongoose";

const commentSchema = new Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    authorId: String,
    authorName: String,
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Comment = models.Comment ?? model("Comment", commentSchema);
