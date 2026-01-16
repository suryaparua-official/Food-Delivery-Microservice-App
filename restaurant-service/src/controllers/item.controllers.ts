import type { Request, Response } from "express";
import { Types } from "mongoose";
import Item from "../models/item.models.js";
import Shop from "../models/restaurant.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import type { AuthRequest } from "../middlewares/isAuth.js";

/* ===================== Add Item ===================== */

export const addItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const ownerId = new Types.ObjectId(req.userId);

    const { name, category, foodType, price } = req.body as {
      name: string;
      category: string;
      foodType: string;
      price: number;
    };

    let image: string | undefined;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    if (!image) {
     return res.status(400).json({ message: "image is required" });
    }

    const shop = await Shop.findOne({ owner: ownerId });
    if (!shop) {
      return res.status(400).json({ message: "shop not found" });
    }

    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });

    shop.items.push(item._id);
    await shop.save();

    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(201).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `add item error ${error}` });
  }
};
/* ===================== Edit Item ===================== */

export const editItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const ownerId = new Types.ObjectId(req.userId);

    const { itemId } = req.params as { itemId: string };
    const { name, category, foodType, price } = req.body as {
      name: string;
      category: string;
      foodType: string;
      price: number;
    };

    let image: string | undefined;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const item = await Item.findByIdAndUpdate(
      itemId,
      { name, category, foodType, price, image },
      { new: true }
    );

    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }

    const shop = await Shop.findOne({ owner: ownerId }).populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `edit item error ${error}` });
  }
};
/* ===================== Get Item By Id ===================== */

export const getItemById = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params as { itemId: string };

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: `get item error ${error}` });
  }
};

/* ===================== Delete Item ===================== */


export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const ownerId = new Types.ObjectId(req.userId);

    const { itemId } = req.params as { itemId: string };

    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }

    const shop = await Shop.findOne({ owner: ownerId });
    if (!shop) {
      return res.status(400).json({ message: "shop not found" });
    }

    shop.items = shop.items.filter(
      (i: any) => i.toString() !== item._id.toString()
    );

    await shop.save();

    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `delete item error ${error}` });
  }
};

/* ===================== Get Items By City ===================== */

export const getItemByCity = async (req: Request, res: Response) => {
  try {
    const { city } = req.params as { city: string };

    if (!city) {
      return res.status(400).json({ message: "city is required" });
    }

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (!shops || shops.length === 0) {
      return res.status(400).json({ message: "shops not found" });
    }

    const shopIds = shops.map((shop) => shop._id);

    const items = await Item.find({ shop: { $in: shopIds } });

    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get item by city error ${error}` });
  }
};

/* ===================== Get Items By Shop ===================== */

export const getItemsByShop = async (req: Request, res: Response) => {
  try {
    const { shopId } = req.params as { shopId: string };

    const shop = await Shop.findById(shopId).populate("items");
    if (!shop) {
      return res.status(400).json({ message: "shop not found" });
    }

    return res.status(200).json({
      shop,
      items: shop.items,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get item by shop error ${error}` });
  }
};

/* ===================== Search Items ===================== */

export const searchItems = async (req: Request, res: Response) => {
  try {
    const { query, city } = req.query as {
      query?: string;
      city?: string;
    };

    if (!query || !city) {
      return res.status(400).json({ message: "query and city are required" });
    }

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (!shops || shops.length === 0) {
      return res.status(400).json({ message: "shops not found" });
    }

    const shopIds = shops.map((s) => s._id);

    const items = await Item.find({
      shop: { $in: shopIds },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).populate("shop", "name image");

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: `search item error ${error}` });
  }
};

/* ===================== Rating ===================== */

export const rating = async (req: Request, res: Response) => {
  try {
    const { itemId, rating } = req.body as {
      itemId: string;
      rating: number;
    };

    if (!itemId || !rating) {
      return res
        .status(400)
        .json({ message: "itemId and rating is required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "rating must be between 1 to 5" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }

    const newCount = item.rating.count + 1;
    const newAverage =
      (item.rating.average * item.rating.count + rating) / newCount;

    item.rating.count = newCount;
    item.rating.average = newAverage;

    await item.save();

    return res.status(200).json({ rating: item.rating });
  } catch (error) {
    return res.status(500).json({ message: `rating error ${error}` });
  }
};
