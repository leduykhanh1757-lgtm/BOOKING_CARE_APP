const { Sequelize } = require('sequelize');
require('dotenv').config();

// Khởi tạo kết nối Sequelize sử dụng biến môi trường từ .env hoặc Railway Variables
const sequelize = new Sequelize(
    process.env.DB_NAME || 'bookingcare',
    process.env.DB_USER || 'avnadmin',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'bookingcare-db-leduykhanh1757-eccb.h.aivencloud.com',
        port: process.env.DB_PORT || 20774,
        dialect: 'mysql',
        logging: false,
        dialectOptions: (process.env.DB_SSL === 'false') ? {} : {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

// Hàm test kết nối
let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to Aiven MySQL database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = connectDB;