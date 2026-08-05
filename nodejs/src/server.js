import express from "express";
import bodyParser from "body-parser";
import initWebRoute from "./route/web";
import dotenv from "dotenv";
import connectDB from "./config/connectDB";
import cors from "cors";
require('cross-fetch/polyfill');

// Tải các biến môi trường từ file .env
import rateLimit from "express-rate-limit";

dotenv.config();

let app = express();

// Giới hạn rate limit: Tối đa 1000 requests / 15 phút cho mỗi IP
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: { errCode: 429, errMessage: "Too many requests from this IP, please try again after 15 minutes." }
});

app.use('/api/', apiLimiter);
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Khởi tạo các route (đường dẫn) web
initWebRoute(app);

connectDB();

// Lấy port từ file .env, nếu không có thì mặc định chạy ở cổng 8080
let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Backend Node.js is running on the port: " + port);
});