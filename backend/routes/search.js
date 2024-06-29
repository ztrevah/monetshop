import express from "express"
import { getProductsList, getProductDetails } from "../controllers/search.js";

const router = express.Router();

router.post("/getproductslist",getProductsList);
router.post("/getproductdetails",getProductDetails);

export default router;