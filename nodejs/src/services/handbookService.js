const db = require("../models");

let createHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check validate dữ liệu đầu vào
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({ errCode: 1, errMessage: 'Missing required parameters!' });
            } else {
                await db.Handbook.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                });
                resolve({ errCode: 0, errMessage: 'Ok' });
            }
        } catch (e) {
            reject(e);
        }
    });
}

let getAllHandbook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy tất cả bài viết, KHÔNG lấy nội dung HTML/Markdown để trang chủ load nhanh hơn
            let data = await db.Handbook.findAll({
                attributes: { exclude: ['descriptionHTML', 'descriptionMarkdown'] }
            });

            // Convert ảnh từ BLOB dưới DB lên thành Base64
            if (data && data.length > 0) {
                data.map(item => {
                    if (item.image) {
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                    }
                    return item;
                })
            }
            resolve({ errCode: 0, errMessage: 'Ok', data });
        } catch (e) {
            reject(e);
        }
    });
}

let editHandbookService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check đầu vào (Bắt buộc phải có ID để biết sửa bài nào)
            if (!data.id || !data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                // Tìm bài viết theo ID
                let handbook = await db.Handbook.findOne({
                    where: { id: data.id },
                    raw: false // để raw: false thì mới dùng được hàm handbook.save() bên dưới
                });

                if (handbook) {
                    handbook.name = data.name;
                    handbook.descriptionHTML = data.descriptionHTML;
                    handbook.descriptionMarkdown = data.descriptionMarkdown;

                    // Chỉ cập nhật ảnh nếu người dùng có chọn ảnh mới
                    if (data.imageBase64) {
                        handbook.image = data.imageBase64;
                    }

                    await handbook.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Update handbook successfully!'
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Handbook not found!'
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailHandbookById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                });
            } else {
                let data = await db.Handbook.findOne({
                    where: { id: inputId }
                });

                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data: data
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    createHandbook: createHandbook,
    getAllHandbook: getAllHandbook,
    editHandbookService: editHandbookService,
    getDetailHandbookById: getDetailHandbookById
}