import express from "express"
import { addtocart, deleteCartItem, getCartDetails, updateCartItem } from "../controllers/cart.js";

const router = express.Router();

router.post("/add",addtocart);
router.post("/details",getCartDetails);
router.put("/updateitem",updateCartItem);
router.delete("/deleteitem",deleteCartItem);


export default router;