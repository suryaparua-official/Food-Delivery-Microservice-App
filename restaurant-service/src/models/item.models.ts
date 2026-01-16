import mongoose, { Schema, Document, Model } from "mongoose";

/* ================= Interface ================= */

export interface IItem extends Document {
  name: string;
  image: string;
  shop?: mongoose.Types.ObjectId;
  category:
    | "Snacks"
    | "Main Course"
    | "Desserts"
    | "Pizza"
    | "Burgers"
    | "Sandwiches"
    | "South Indian"
    | "North Indian"
    | "Chinese"
    | "Fast Food"
    | "All";
  price: number;
  foodType: "veg" | "non veg";
  rating: {
    average: number;
    count: number;
  };
}

/* ================= Schema ================= */

const itemSchema: Schema<IItem> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
    },

    category: {
      type: String,
      enum: [
        "Snacks",
        "Main Course",
        "Desserts",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "South Indian",
        "North Indian",
        "Chinese",
        "Fast Food",
        "All",
      ],
      required: true,
    },

    price: {
      type: Number,
      min: 0,
      required: true,
    },

    foodType: {
      type: String,
      enum: ["veg", "non veg"],
      required: true,
    },

    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

/* ================= Model ================= */

const Item: Model<IItem> = mongoose.model<IItem>("Item", itemSchema);

export default Item;
