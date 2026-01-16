import express from "express"
import { createEditShop, getMyShop, getShopByCity } from "../controllers/restaurant.controllers.js"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"



const restaurantRouter=express.Router()

restaurantRouter.post("/create-edit",isAuth,upload.single("image"), createEditShop)
restaurantRouter.get("/get-my",isAuth, getMyShop)
restaurantRouter.get("/get-by-city/:city",isAuth, getShopByCity)

export default restaurantRouter