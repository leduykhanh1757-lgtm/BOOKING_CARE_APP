const { Sequelize } = require('sequelize');

// Khởi tạo kết nối Sequelize với thông tin database của bạn
const sequelize = new Sequelize('database_development', 'root', 'Khanh17572005@?!', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false // Thêm dòng này để Terminal đỡ in ra nhiều câu lệnh SQL mặc định cho đỡ rối mắt
});

// Hàm test kết nối
let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = connectDB;