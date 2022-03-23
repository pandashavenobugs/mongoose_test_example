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
  it("PostSchema nested  create test", async () => {
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

  it("nested PostSchema update test", async () => {
    const userInput: UserInput = {
      name: "userTest",
    };
    const user = new UserModel({ ...userInput });
    const postInput: PostInput = {
      title: "postTest",
    };
    user!.posts!.push({ ...postInput });
    const newUSer = await user.save();
    const post = newUSer!.posts![0];

    const childPost = newUSer!.posts!.id(post._id);
    // childPost!.title = "deneme";
    childPost!.set({ title: "test" });
    const index = newUSer!.posts!.indexOf(childPost!);
    console.log(index);
    await newUSer!.save();
    console.log(newUSer!);
    const fetchedUSer = await UserModel.findOne({ _id: newUSer._id });
    console.log(fetchedUSer!);
  });
});
