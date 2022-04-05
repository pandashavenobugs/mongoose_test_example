import mongoose, { Document, Types, Schema } from "mongoose";

export interface CommentInput {
  content: string;
  user: string;
}

export interface CommentDocument extends Document, Omit<CommentInput, "user"> {
  content: string;
  user: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export const CommentSchema = new Schema<CommentDocument>({
  content: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

const CommentModel = mongoose.model("Comment", CommentSchema);

export default CommentModel;
