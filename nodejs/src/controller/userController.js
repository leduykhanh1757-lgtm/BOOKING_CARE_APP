import userService from '../services/userService';
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // Bắt lỗi nếu người dùng không nhập đủ
    if (!email || !password) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }

    // Gọi anh thủ kho Service đi kiểm tra và chờ lấy kết quả
    let userData = await userService.handleUserLogin(email, password);

    // Trả cục data về cho phía Client (React)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {} // Nếu có user thì ném ra, không có thì ném object rỗng
    })
}

let getAllUsers = async (req, res) => {
    let id = req.query.id; // All, id

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameters!',
            users: []
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })

}

module.exports = {
    handleLogin: handleLogin,
    getAllUsers: getAllUsers
}