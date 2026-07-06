// backend/src/services/packageService.js
import db from "../models/index";

let createNewPackage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.price || !data.imageBase64 || !data.descriptionHTML) {
                resolve({ errCode: 1, errMessage: 'Missing required parameters!' });
            } else {
                await db.Package.create({
                    name: data.name,
                    price: data.price,
                    clinicId: data.clinicId,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                });
                resolve({ errCode: 0, errMessage: 'Tạo gói khám thành công!' });
            }
        } catch (e) {
            reject(e);
        }
    });
}

let getAllPackages = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let packages = await db.Package.findAll();
            // Convert Buffer Base64 cho ảnh
            if (packages && packages.length > 0) {
                packages.map(item => {
                    if (item.image) {
                        item.image = new Buffer(item.image, 'base64').toString('binary');
                    }
                    return item;
                });
            }
            resolve({ errCode: 0, data: packages });
        } catch (e) {
            reject(e);
        }
    });
}

let editPackage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.price || !data.clinicId || !data.descriptionHTML) {
                resolve({ errCode: 1, errMessage: 'Missing required parameters!' });
            } else {
                let packageData = await db.Package.findOne({
                    where: { id: data.id },
                    raw: false // Bắt buộc raw: false để dùng được hàm save() của Sequelize
                });

                if (packageData) {
                    packageData.name = data.name;
                    packageData.price = data.price;
                    packageData.clinicId = data.clinicId;
                    packageData.descriptionHTML = data.descriptionHTML;
                    packageData.descriptionMarkdown = data.descriptionMarkdown;

                    // Nếu bác có chọn ảnh mới thì mới đè ảnh, không thì giữ nguyên ảnh cũ
                    if (data.imageBase64) {
                        packageData.image = data.imageBase64;
                    }

                    await packageData.save();
                    resolve({ errCode: 0, errMessage: 'Cập nhật gói khám thành công!' });
                } else {
                    resolve({ errCode: 2, errMessage: 'Không tìm thấy gói khám!' });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
}

let getDetailPackageById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({ errCode: 1, errMessage: 'Missing ID' });
            } else {
                let data = await db.Package.findOne({ where: { id: inputId } });
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                resolve({ errCode: 0, data: data });
            }
        } catch (e) { reject(e); }
    });
}

let postBookPackage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 🛠️ Tạm thời giả lập thành công để test mượt luồng Frontend. 
            // Tương lai bác móc vào bảng Bookings giống hệt hàm đặt lịch Bác sĩ nhé!
            if (!data.email || !data.fullName) {
                resolve({ errCode: 1, errMessage: 'Vui lòng điền đủ thông tin!' });
            } else {
                resolve({ errCode: 0, errMessage: 'Đặt lịch thành công!' });
            }
        } catch (e) { reject(e); }
    });
}
module.exports = { createNewPackage, getAllPackages, editPackage, getDetailPackageById, postBookPackage };