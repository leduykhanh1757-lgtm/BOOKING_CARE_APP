const db = require("../models");

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem đầu vào có bị rỗng không
            if (!data.name || !data.address ||
                !data.imageBase64 || !data.descriptionHTML ||
                !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                // Đẩy dữ liệu vào bảng Clinics
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Lưu phòng khám thành công!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                attributes: ['id', 'name', 'image']
            });
            if (data && data.length > 0) {
                data.map(item => {
                    // Kiểm tra null và dùng Buffer.from để bảo mật
                    if (item.image) {
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                    }
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({ errCode: 1, errMessage: 'Missing parameter' })
            } else {
                let data = await db.Clinic.findOne({
                    where: { id: inputId },
                    // Thêm 'image' vào đây
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown', 'image'],
                    raw: true
                })

                if (data) {
                    // Giải mã ảnh để hiển thị lên Form chỉnh sửa
                    if (data.image) {
                        data.image = Buffer.from(data.image, 'base64').toString('binary');
                    }

                    let doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId', 'provinceId'],
                    })
                    data.doctorClinic = doctorClinic;
                } else {
                    data = {}
                }

                resolve({ errCode: 0, errMessage: 'ok', data })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let editClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.address || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({ errCode: 1, errMessage: 'Missing required parameters!' })
            } else {
                let clinic = await db.Clinic.findOne({
                    where: { id: data.id },
                    raw: false // ⚠️ Phải để false để dùng được hàm .save() của Sequelize
                })

                if (clinic) {
                    clinic.name = data.name;
                    clinic.address = data.address;
                    clinic.descriptionHTML = data.descriptionHTML;
                    clinic.descriptionMarkdown = data.descriptionMarkdown;

                    // Nếu người dùng có chọn ảnh mới thì cập nhật, không thì giữ nguyên ảnh cũ
                    if (data.imageBase64) {
                        clinic.image = data.imageBase64;
                    }

                    await clinic.save();
                    resolve({ errCode: 0, errMessage: 'Update clinic succeed!' })
                } else {
                    resolve({ errCode: 2, errMessage: 'Clinic not found!' })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    editClinic: editClinic
}