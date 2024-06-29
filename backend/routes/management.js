import express from "express"
import { getorderhistory, getorderinfo, getorderitems, getorderlist, getproductinfo, getproductlist, login, logout, verify } from "../controllers/management.js";

const router = express.Router();
router.post("/login",login);
router.post("/logout",logout);
router.post("/verify",verify);
router.post("/productlist",getproductlist);
router.post("/productinfo",getproductinfo);
router.post("/orderlist",getorderlist);
router.post("/orderinfo",getorderinfo);
router.post("/orderitems",getorderitems);
router.post("/orderhistory",getorderhistory);

export default router;