import mongoose from "mongoose";
export interface PostInput {
  title?: string;
}

export interface PostDocument extends mongoose.Document, PostInput {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubPostDocument extends mongoose.Types.Subdocument, PostInput {
  createdAt?: Date;
  updatedAt?: Date;
}

export const PostSchema = new mongoose.Schema<PostDocument>(
  {
    title: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
export const SubPostSchema = new mongoose.Schema<SubPostDocument>(
  {
    title: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

// export interface PostDocument extends PostInput, mongoose.Document {
//   createdAt?: Date;
//   updateAt?: Date;
// }

const PostModel = mongoose.model("Post", PostSchema);

export default PostModel;
