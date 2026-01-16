import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  image: string;
  owner: Types.ObjectId;
  city: string;
  state: string;
  address: string;
  items: Types.ObjectId[];
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
  },
  { timestamps: true }
);

const Restaurant = mongoose.model<IRestaurant>("restaurant", restaurantSchema);
export default Restaurant;
