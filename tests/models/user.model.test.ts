//https://stackoverflow.com/questions/57698371/missing-subdocument-methods-in-mongoose-with-typescript
import { connectToDB, disconnectDB } from "../databaseConnector";
import UserModel, {
  UserDocument,
  UserInput,
} from "../../src/models/User.model";
import PostModel, { PostInput } from "../../src/models/Post.model";

//https://stackoverflow.com/questions/26156687/mongoose-find-update-subdocument

describe("connecting to db and testting the UserModel crud", () => {
  beforeAll(async () => {
    await connectToDB();
  });
  afterAll(async () => {
    await UserModel.collection.drop();
    await disconnectDB();
  });
  it("UserModel create test", async () => {
    const userInput: UserInput = {
      name: "userTest",
    };
    const user = new UserModel({ ...userInput });
    const newUSer = await user.save();
    expect(newUSer._id).toBeDefined();
  });
  it("PostSchema Array nested  create test", async () => {
    const userInput: UserInput = {
      name: "userTest",
    };
    const user = new UserModel({ ...userInput });
    const newUSer = await user.save();
    const fetchedUSer = await UserModel.findOne({ _id: newUSer._id });
    const postInput: PostInput = {
      title: "postTest",
    };
    fetchedUSer!.posts!.push({ ...postInput });
    const savedFetchedUser = await fetchedUSer!.save();
    const childPost = savedFetchedUser!.posts!.id(
      savedFetchedUser!.posts![0]._id
    );
    expect(savedFetchedUser!.posts!.length).toBeGreaterThan(0);
    expect(savedFetchedUser!.posts![0]._id).toBeDefined();
    expect(childPost).toBeDefined();
    // const newPostC = PostModel.create({ ...postInput });
  });
  // we have 2 ways to update the nestedDocuments
  // 1st way
  it("nested PostSchema Array update test in 1st way", async () => {
    const userInput: UserInput = {
      name: "userTest",
    };
    const user = new UserModel({ ...userInput });
    const postInput: PostInput = {
      title: "postTest",
    };
    user!.posts!.push({ ...postInput });
    const newUSer = await user.save();

    const fetchedNewUser = await UserModel.findOne({ _id: newUSer._id });
    const postAsNestedDocument = fetchedNewUser!.posts![0];
    expect(postAsNestedDocument).toBeDefined();
    expect(postAsNestedDocument.title).toEqual(postInput.title);

    //Update Side
    //fetch the post from posts
    const postFetchedFromPosts = fetchedNewUser!.posts!.id(
      postAsNestedDocument!._id
    );
    expect(postFetchedFromPosts).toBeDefined();

    postFetchedFromPosts!.set({ title: "postTitle changed in 1st way" });
    // we can update the data  also like that
    // fetchedNewUser!
    //   .posts!.id(postAsNestedDocument!._id)
    //   .set({ title: "postTitle changed in 1st way" });
    await fetchedNewUser!.save();

    const updatedUser = await UserModel.findOne({ _id: fetchedNewUser!._id });
    const updatedNestedPost = updatedUser!.posts!.id(postFetchedFromPosts!._id);
    expect(updatedNestedPost!.title).toEqual("postTitle changed in 1st way");
  });
  it("nested PostSchema Array update test in 2nd way", async () => {
    const userInput: UserInput = {
      name: "userTest",
    };
    const user = new UserModel({ ...userInput });
    const postInput: PostInput = {
      title: "postTest",
    };
    user!.posts!.push({ ...postInput });
    const newUSer = await user.save();

    const fetchedNewUser = await UserModel.findOne({ _id: newUSer._id });
    const postAsNestedDocument = fetchedNewUser!.posts![0];
    expect(postAsNestedDocument).toBeDefined();
    expect(postAsNestedDocument.title).toEqual(postInput.title);

    //Update Side
    const indexNumber = fetchedNewUser!.posts!.findIndex(
      (post) => `${post._id}` === `${postAsNestedDocument!._id}`
    );
    const post = fetchedNewUser!.posts![indexNumber];
    post!.title = "postTitle changed in 2nd way";
    fetchedNewUser!.posts!.set(indexNumber, post);
    // we can update the data  also like that
    // fetchedNewUser!.posts!.set(indexNumber, {
    //   title: "postTitle changed in 2nd way",
    // } as any);
    await fetchedNewUser!.save();
    const updatedUser = await UserModel.findOne({ _id: fetchedNewUser!._id });
    const updatedNestedPost = updatedUser!.posts!.id(postAsNestedDocument!._id);
    // console.log(updatedNestedPost);
    expect(updatedNestedPost!.title).toEqual("postTitle changed in 2nd way");
  });
});
