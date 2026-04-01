import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./config/ViewEngine";
import initWebRoute from "./route/web";
import dotenv from "dotenv";
import connectDB from "./config/connectDB";
import cors from "cors";

// Tải các biến môi trường từ file .env
dotenv.config();

let app = express();
app.use(cors({ credentials: true, origin: true })); // Cho phép truy cập từ các domain khác
// Cấu hình body-parser để server hiểu được dữ liệu client gửi lên
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// Khởi tạo cấu hình View Engine
configViewEngine(app);

// Khởi tạo các route (đường dẫn) web
initWebRoute(app);

connectDB();

// Lấy port từ file .env, nếu không có thì mặc định chạy ở cổng 8080
let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Backend Node.js is running on the port: " + port);
});