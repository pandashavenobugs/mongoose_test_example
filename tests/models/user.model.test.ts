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
    const savedPost = savedFetchedUser!.posts![0];

    expect(savedFetchedUser!.posts!.length).toBeGreaterThan(0);
    expect(savedFetchedUser!.posts![0]._id).toBeDefined();
    // const newPostC = PostModel.create({ ...postInput });
  });
});
