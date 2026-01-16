import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (file: string): Promise<string | undefined> => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
  });

  try {
    const result = await cloudinary.uploader.upload(file);
    fs.unlinkSync(file);
    return result.secure_url;
  } catch (error) {
    fs.unlinkSync(file);
    console.log(error);
    return undefined;
  }
};

export default uploadOnCloudinary;
