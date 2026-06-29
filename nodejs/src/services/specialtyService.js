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
            // Móc toàn bộ data từ bảng Specialties
            let data = await db.Specialty.findAll({
                // Tùy chọn: bỏ qua descriptionHTML và descriptionMarkdown để API trả về nhanh hơn nếu trang chủ không cần dùng đến
            });

            // Nếu có data, tiến hành dịch ngược ảnh BLOB sang chuỗi Base64
            if (data && data.length > 0) {
                data.map(item => {
                    if (item.image) {
                        //  (Dùng Buffer.from thay vì new Buffer để không bị văng warning gạch ngang đỏ)
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                    }
                    return item;
                })
            }

            resolve({
                errCode: 0,
                errMessage: 'ok',
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
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                    raw: true
                })

                if (data) {
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

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById
}