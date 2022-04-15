import faker from "@faker-js/faker";
import { connectToDB, disconnectDB } from "../databaseConnector";
import UserModel, {
  UserInput,
  UserDocument,
} from "../../src/models/User.model";
import BlogPostModel, { BlogPostInput } from "../../src/models/BlogPost.model";
import CommentModel, { CommentInput } from "../../src/models/Comment.model";

describe("connecting to db and testing the UserModel associations", () => {
  beforeAll(async () => {
    await connectToDB();
  });
  afterAll(async () => {
    await UserModel.collection.drop();
    await BlogPostModel.collection.drop();
    await CommentModel.collection.drop();
    await disconnectDB();
  });

  it("Association Test", async () => {
    const userInput: UserInput = {
      name: "berat",
    };

    const user = new UserModel({ ...userInput });
    for (let i = 0; i < 2; i++) {
      const blogPostInput: BlogPostInput = {
        title: faker.animal.bear(),
        content: faker.hacker.phrase(),
      };
      const blogPost = new BlogPostModel({ ...blogPostInput });

      for (let j = 0; j < 50; j++) {
        const commentInput: CommentInput = {
          content: faker.hacker.phrase(),
          user: user._id,
        };
        const comment = new CommentModel({ ...commentInput });
        blogPost!.comments.push(comment!._id);
        await comment.save();
      }
      user!.blogPosts.push(blogPost!._id);
      await blogPost.save();
    }
    await user.save();

    const fetchedUser = await UserModel.findOne({ _id: user!._id });

    expect(fetchedUser!).toBeDefined();
    expect(fetchedUser!.blogPosts.length).toEqual(2);

    const fetchedBlogPosts = await BlogPostModel.find({
      _id: { $in: fetchedUser!.blogPosts },
    });
    // console.log(fetchedBlogPosts!);
    expect(fetchedBlogPosts!.length).toEqual(2);

    for (let i = 0; i < fetchedBlogPosts!.length; i++) {
      const fetchedBlogPost = fetchedBlogPosts![i];
      const fetchedComments = await CommentModel.find({
        _id: { $in: fetchedBlogPost.comments },
      });
      expect(fetchedComments!.length).toEqual(50);
    }
    // delete blogPost from user
    const blogPostId = fetchedBlogPosts![0]._id;

    await UserModel.updateOne(
      { blogPosts: blogPostId },
      {
        $pull: { blogPosts: blogPostId },
      }
    );
    await CommentModel.deleteMany({
      _id: { $in: fetchedBlogPosts[0]!.comments },
    });
    const newFetchedUser = await UserModel.findOne({ _id: user!._id });
    const newFetchedComments = await CommentModel.find();
    expect(newFetchedUser!.blogPosts.length).toEqual(1);
    expect(newFetchedComments.length!).toEqual(50);
    // console.log(newFetchedUser!);
  });
});
