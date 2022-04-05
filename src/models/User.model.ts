import mongoose from "mongoose";
import {
  BlogPostDocument,
  BlogPostInput,
  BlogPostSchema,
} from "./BlogPost.model";
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
  blogPosts?: BlogPostInput[];
}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, required: true },
    // postCount: { type: Number, default: 0 },
    posts: [PostSchema],
    blogPosts: [BlogPostSchema],
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("postCount").get(function (this: UserDocument): Number {
  return this.posts ? this.posts.length : 0;
});
// if we want to omit keys more than one
//Omit<UserInput, "posts" | "postCount">
// if we want to omit a key we can use Omit<UserInput, "posts" >
export interface UserDocument
  extends Omit<UserInput, "posts" | "blogPosts">,
    mongoose.Document {
  updateAt: Date;
  createdAt: Date;
  posts?: mongoose.Types.DocumentArray<PostDocument>;
  postCount?: number;
  blogPosts?: mongoose.Types.DocumentArray<BlogPostDocument>;
}

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
