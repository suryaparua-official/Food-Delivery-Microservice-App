import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("Delivery DB connected!");
  } catch (error) {
    console.error("DB connection failed!", error);
  }
};

export default connectDb;
