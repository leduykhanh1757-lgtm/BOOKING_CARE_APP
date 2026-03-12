import db from '../models/index';
import bcrypt from 'bcryptjs';

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            // Gọi hàm checkUserEmail lúc nãy để xem email có tồn tại không
            let isExist = await checkUserEmail(email);

            if (isExist) {
                // Nếu tồn tại -> Chui vào DB lấy user đó ra
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });

                if (user) {
                    // Dùng bcrypt so sánh mật khẩu nhập vào và mật khẩu trong DB
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';

                        delete user.password; // Cực kỳ quan trọng: Xóa password đi trước khi gửi về React để bảo mật
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'User not found';
                }
            } else {
                // Nếu không tồn tại -> Trả về lỗi
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Please try other email!`;
            }
            resolve(userData); // Trả cục kết quả ra cho Controller
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Dùng Sequelize tìm 1 bản ghi trong bảng User
            let user = await db.User.findOne({
                where: { email: userEmail }
            });

            // Nếu tìm thấy user thì trả về true, không thấy trả về false
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'All') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password'] // Exclude password khi trả về cho React
                    }
                });
            }
            if (userId && userId !== 'All') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password'] // Exclude password khi trả về cho React
                    }
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers
}