import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("User DB connected!");
  } catch (error) {
    console.error("Database connection failed!", error);
  }
};

export default connectDb;
