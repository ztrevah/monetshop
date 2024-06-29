import express from "express"
import { createorder, getCustomerOrder, getorderitems, searchorder } from "../controllers/order.js";

const router = express.Router();

router.post("/create",createorder);
router.post("/getcustomerorder",getCustomerOrder);
router.post("/getorderitems",getorderitems);
router.post("/searchorder",searchorder);

export default router;