import db from '../models/index';
import bcrypt from 'bcryptjs';
import CRUDservices from './CRUDservices';

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

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra email đã tồn tại chưa
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used, please try another email!'
                })
            }
            else {
                // Nếu chưa tồn tại thì hash password và tạo mới user
                let hashPasswordFromBcrypt = await CRUDservices.hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,
                    positionId: data.positionId,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. BƯỚC BẢO VỆ: Kiểm tra đầu vào cực kỳ chặt chẽ
            // Dùng data.gender === undefined để lách lỗi Javascript coi số 0 là rỗng
            if (!data.id || !data.roleId || !data.positionId || data.gender === undefined) {
                // BẮT BUỘC PHẢI CÓ 'return' ĐỂ DỪNG NGAY HÀM LẠI NẾU CÓ LỖI
                return resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters!'
                });
            }

            // 2. TÌM KIẾM: Lôi người dùng từ Database lên
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false // Bắt buộc raw: false để giữ lại các hàm của Sequelize (như hàm save)
            });

            // 3. CẬP NHẬT: Nếu tìm thấy thì đổ dữ liệu mới vào
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                if (data.gender === '1') {
                    user.gender = true;
                } else {
                    user.gender = false;
                }

                // Nếu DB của bạn có trường phoneNumber thì cập nhật luôn
                if (data.phoneNumber) {
                    user.phoneNumber = data.phoneNumber;
                }

                // 4. LƯU LẠI: Đẩy cục dữ liệu đã cập nhật xuống Database
                await user.save();

                return resolve({
                    errCode: 0,
                    errMessage: 'Update the user succeeds!'
                });
            } else {
                // Truyền một cái ID bậy bạ không tồn tại trong DB
                return resolve({
                    errCode: 1,
                    errMessage: 'User not found!'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'The user is not exist'
                })
            }
            await db.User.destroy({
                where: { id: userId }
            })
            resolve({
                errCode: 0,
                errMessage: 'The user is deleted'
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!',
                })
            }
            let res = {};
            let allcode = await db.Allcode.findAll({
                where: { type: typeInput }
            });
            res.errCode = 0;
            res.errMessage = 'OK';
            res.data = allcode;
            resolve(res);
        }
        catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getAllCodeService: getAllCodeService
}