import bcrypt from 'bcryptjs';
import db from '../models/index';
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Băm mật khẩu
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);

            // 2. Lưu vào database dùng hàm create() của Sequelize
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt, // Nhớ truyền mật khẩu đã băm, đừng truyền mật khẩu thô nhé!
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false, // Dịch 1 thành true, 0 thành false
                roleId: data.roleId
            });

            // 3. Báo cáo thành công
            resolve('success!');
        } catch (e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lệnh findAll() để gom toàn bộ dữ liệu trong bảng Users
            let users = await db.User.findAll({
                raw: true, // Thêm dòng này để Sequelize trả về cục data thô gọn gàng, bỏ đi các thông tin hệ thống rườm rà
            });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Dùng hàm findOne để tìm đúng 1 bản ghi
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true, // Nhớ thêm raw: true để dữ liệu trả về là dạng mảng thuần túy dễ đọc
            });

            if (user) {
                resolve(user);
            } else {
                resolve({}); // Nếu không tìm thấy thì trả về mảng rỗng
            }
        } catch (e) {
            reject(e);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Bước 1: Tìm người dùng trong database dựa vào cái ID gửi lên
            let user = await db.User.findOne({
                where: { id: data.id }
                // LƯU Ý CỰC KỲ QUAN TRỌNG: Ở đây tuyệt đối KHÔNG ĐƯỢC để raw: true
                // Nếu để raw: true, Sequelize sẽ không cho phép bạn dùng hàm save() ở dưới
            });

            if (user) {
                // Bước 2: Ghi đè dữ liệu mới vào dữ liệu cũ
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;

                // Bước 3: Lưu lại cục thay đổi này vào Database
                await user.save();

                // Bước 4: Lấy lại toàn bộ danh sách người dùng mới để trả về cho Controller
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            } else {
                resolve(); // Nếu không tìm thấy ai thì thôi, không làm gì cả
            }
        } catch (e) {
            console.log(e);
            reject(e);
        }
    })
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Tìm cái user cần xóa
            let user = await db.User.findOne({
                where: { id: userId }
            });

            if (user) {
                // Nếu tìm thấy thì dùng hàm destroy() của Sequelize để xóa sổ nó khỏi Database
                await user.destroy();
            }

            resolve(); // Báo cáo xong việc
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById
}