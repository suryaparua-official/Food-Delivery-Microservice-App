import type { Response } from "express";
import { Types } from "mongoose";
import Restaurant from "../models/restaurant.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import type { AuthRequest } from "../middlewares/isAuth.js";


/* ================= Create / Edit Shop ================= */
export const createEditShop = async (req: AuthRequest, res: Response) => {
  try {
    const { name, city, state, address } = req.body as {
      name: string;
      city: string;
      state: string;
      address: string;
    };

    if (!req.userId) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const ownerId = new Types.ObjectId(req.userId);

    let image: any;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let shop = await Restaurant.findOne({ owner: ownerId });

    if (!shop) {
      shop = await Restaurant.create({
        name,
        city,
        state,
        address,
        image,
        owner: ownerId,
      });
    } else {
      shop = await Restaurant.findByIdAndUpdate(
        shop._id,
        {
          name,
          city,
          state,
          address,
          image,
          owner: ownerId,
        },
        { new: true }
      );
    }

    return res.status(201).json({
      _id: shop?._id,
      name: shop?.name,
      city: shop?.city,
      state: shop?.state,
      address: shop?.address,
      owner: shop?.owner,
      items: shop?.items ?? [],
    });
  } catch (error) {
    return res.status(500).json({ message: `create shop error ${error}` });
  }
};



{/* ================================ Get My Shop ============================ */}

export const getMyShop = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const ownerId = new Types.ObjectId(req.userId);

    const shop = await Restaurant.findOne({ owner: ownerId });

    if (!shop) {
      return res.status(200).json(null);
    }

    return res.status(200).json({
      _id: shop._id,
      name: shop.name,
      city: shop.city,
      state: shop.state,
      address: shop.address,
      image: shop.image,
      owner: shop.owner,
      items: shop.items, 
    });
  } catch (error) {
    return res.status(500).json({ message: `get my shop error ${error}` });
  }
};


{/* =========================== Get Shop By City =========================== */}

export const getShopByCity = async (req: AuthRequest, res: Response) => {
  try {
    const { city } = req.params as { city: string };

    const shops = await Restaurant.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    });

    if (!shops || shops.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(
      shops.map((shop) => ({
        _id: shop._id,
        name: shop.name,
        city: shop.city,
        state: shop.state,
        address: shop.address,
        image: shop.image,
        owner: shop.owner,
        items: shop.items,
      }))
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get shop by city error ${error}` });
  }
};

