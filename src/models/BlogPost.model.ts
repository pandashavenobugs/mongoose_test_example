import mongoose, { Document, Schema, model, Types } from "mongoose";

export interface BlogPostInput {
  title: string;
  content: string;
  comments: string[];
}
export interface BlogPostDocument
  extends Document,
    Omit<BlogPostInput, "comments"> {
  comments?: [Schema.Types.ObjectId];
  createdAt?: Date;
  updatedAt?: Date;
}
export const BlogPostSchema = new Schema<BlogPostDocument>(
  {
    title: { type: String, required: false },
    content: { type: String, required: false },
    comments: [{ type: Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);
const BlogPostModel = model("BlogPost", BlogPostSchema);

export default BlogPostModel;
