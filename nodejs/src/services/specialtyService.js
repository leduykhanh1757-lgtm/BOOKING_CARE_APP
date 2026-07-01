import db from "../models/index";

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Check xem Frontend có gửi thiếu trường nào không
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                // 2. Tạo mới một bản ghi trong bảng Specialties
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Save new specialty successfully!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                attributes: ['id', 'name', 'image']
            });
            if (data && data.length > 0) {
                data.map(item => {
                    // Dùng Buffer.from cho chuẩn bảo mật
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

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                // 1. Tìm thông tin miêu tả của Chuyên khoa
                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'name', 'image'],
                    raw: true
                })

                if (data) {
                    if (data.image) {
                        data.image = Buffer.from(data.image, 'base64').toString('binary');
                    }
                    let doctorSpecialty = [];
                    // 2. Tìm danh sách bác sĩ thuộc chuyên khoa này
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                            raw: true
                        })
                    } else {
                        // Tìm theo tỉnh thành (Dành cho chức năng lọc sau này)
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                            raw: true
                        })
                    }

                    // Gộp mảng bác sĩ vào cục data trả về
                    data.doctorSpecialty = doctorSpecialty;
                } else data = {}; // Tránh bị lỗi null

                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let editSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({ errCode: 1, errMessage: 'Missing required parameters!' })
            } else {
                let specialty = await db.Specialty.findOne({
                    where: { id: data.id },
                    raw: false // Phải để false để xài hàm save() của Sequelize
                })

                if (specialty) {
                    specialty.name = data.name;
                    specialty.descriptionHTML = data.descriptionHTML;
                    specialty.descriptionMarkdown = data.descriptionMarkdown;

                    // Nếu bác up ảnh mới thì lưu, không thì giữ nguyên ảnh cũ
                    if (data.imageBase64) {
                        specialty.image = data.imageBase64;
                    }

                    await specialty.save();
                    resolve({ errCode: 0, errMessage: 'Update specialty succeed!' })
                } else {
                    resolve({ errCode: 2, errMessage: 'Specialty not found!' })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    editSpecialty: editSpecialty
}