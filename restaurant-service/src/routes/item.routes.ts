import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import {
  addItem,
  editItem,
  deleteItem,
  getItemByCity,
  getItemsByShop,
  searchItems,
  rating
} from "../controllers/item.controllers.js"

const router = express.Router()

router.post("/add", isAuth, upload.single("image"), addItem)
router.put("/edit/:itemId", isAuth, upload.single("image"), editItem)
router.delete("/delete/:itemId", isAuth, deleteItem)

router.get("/by-city/:city", getItemByCity)
router.get("/by-shop/:shopId", getItemsByShop)
router.get("/search", searchItems)
router.post("/rating", isAuth, rating)

export default router
