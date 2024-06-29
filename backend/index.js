import express from "express"
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cart.js";
import userRoutes from "./routes/users.js";
import searchRoutes from "./routes/search.js"
import orderRoutes from "./routes/order.js"
import managementRoutes from "./routes/management.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { db } from "./db.js";
dotenv.config();

const app = express();
app.use(cors({credentials: true, origin: ["http://localhost:3000","http://localhost:5000"]}));
app.use(express.json());
app.use(cookieParser());
app.use("/backend/auth/",authRoutes);
app.use("/backend/cart/",cartRoutes);
app.use("/backend/users/",userRoutes);
app.use("/backend/search/",searchRoutes);
app.use("/backend/order/",orderRoutes);
app.use("/backend/management/",managementRoutes);

let PORT = process.env.PORT || 9090;
app.listen(9090,() => {
    console.log("Connected");
})