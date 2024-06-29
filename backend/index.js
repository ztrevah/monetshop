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
dotenv.config();

const app = express();
app.use(cors({credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth/",authRoutes);
app.use("/api/cart/",cartRoutes);
app.use("/api/users/",userRoutes);
app.use("/api/search/",searchRoutes);
app.use("/api/order/",orderRoutes);
app.use("/api/management/",managementRoutes);

let PORT = process.env.PORT || 9090;
app.listen(9090,() => {
    console.log("Connected");
});
app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.get("/",(req,res) => {
    return res.status(200).json("Connected");
})