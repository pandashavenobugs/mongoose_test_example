import mongoose from "mongoose";
import {
  PostSchema,
  PostDocument,
  SubPostSchema,
  PostInput,
} from "./Post.model";

export interface UserInput {
  name: string;
  postCount?: number;
  // posts?: mongoose.Types.DocumentArray<PostDocument>;
  posts?: PostInput[];
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
export interface UserDocument
  extends Omit<UserInput, "posts" | "postCount">,
    mongoose.Document {
  updateAt: Date;
  createdAt: Date;
  posts?: mongoose.Types.DocumentArray<PostDocument>;
  postCount?: number;
}

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
