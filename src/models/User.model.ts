import mongoose from "mongoose";
import { PostSchema, PostDocument, SubPostSchema } from "./Post.model";

export interface UserInput {
  name: string;
  postCount?: number;
  posts?: mongoose.Types.DocumentArray<PostDocument>;
}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: true },
    // postCount: { type: Number, default: 0 },
    posts: [SubPostSchema],
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("postCount").get(function (this: UserDocument): Number {
  return this.posts ? this.posts.length : 0;
});
export interface UserDocument extends UserInput, mongoose.Document {
  updateAt: Date;
  createdAt: Date;
}

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
