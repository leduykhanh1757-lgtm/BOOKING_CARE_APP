import db from "../models/index";
import CRUDService from '../services/CRUDservices';
let gethomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }
}

let getAboutPage = (req, res) => {
    return res.render("test/about.ejs");
}

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
}

let PostCRUD = async (req, res) => {
    // req.body chính là cái túi chứa toàn bộ dữ liệu mà form (thẻ name) gửi lên
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);

    return res.send('Post CRUD from server');
}

let displayGetCRUD = async (req, res) => {
    // Nhờ Nhà bếp (Service) đi lấy toàn bộ dữ liệu người dùng
    let data = await CRUDService.getAllUser();
    // Ném dữ liệu đó ra file giao diện (chúng ta sẽ tạo file này sau)
    return res.render('displayCRUD.ejs', {
        dataTable: data
    });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id; // Lấy id từ URL

    // Nếu có id thì mới đi tìm, không thì báo lỗi
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);

        // Render ra file giao diện editCRUD.ejs và truyền dữ liệu user vừa tìm được sang
        return res.render('editCRUD.ejs', {
            user: userData
        });
    } else {
        return res.send('User not found!');
    }
}

let putCRUD = async (req, res) => {
    let data = req.body; // Hứng toàn bộ dữ liệu từ form (bao gồm cả data.id ẩn)

    // Gọi Nhà bếp đi cập nhật, và chờ lấy về danh sách user mới nhất
    let allUsers = await CRUDService.updateUserData(data);

    // Render lại trang danh sách với dữ liệu đã được cập nhật
    return res.render('displayCRUD.ejs', {
        dataTable: allUsers
    });
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id; // Lấy id từ URL

    // Nếu có id thì mới đi xóa, không thì báo lỗi      
    if (id) {
        // Nhờ Nhà bếp đi xóa user có id này
        await CRUDService.deleteUserById(id);

        return res.redirect('/get-crud');
    } else {
        return res.send('Không tìm thấy người dùng để xóa!');
    }
}
module.exports = {
    gethomePage: gethomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    PostCRUD: PostCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
};