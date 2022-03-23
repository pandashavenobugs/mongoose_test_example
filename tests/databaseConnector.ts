import mongoose from "mongoose";

export async function connectToDB() {
  try {
    const dbUri = "mongodb://localhost:27018";
    const dbName = "test";
    await mongoose.connect(dbUri, {
      dbName,
      autoCreate: true,
    });
    // console.log("DB connected");
  } catch (error) {
    console.log("DB connect error");
  }
}

export async function disconnectDB() {
  try {
    await mongoose.connection.close();
    // console.log("db disconnected");
  } catch (error) {
    console.log("db disconnect error");
  }
}
