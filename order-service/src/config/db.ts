import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("Order DB connected!");
  } catch (error) {
    console.error("Order DB connection failed", error);
  }
};

export default connectDb;
