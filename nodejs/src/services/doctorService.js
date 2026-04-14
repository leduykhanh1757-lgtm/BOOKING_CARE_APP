import db from '../models/index';

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })

            if (users && users.length > 0) {
                users = users.map(item => {
                    if (item.image) {
                        item.image = new Buffer(item.image, 'base64').toString('binary');
                    }
                    return item;
                })
            }

            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e);
        }
    })
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Check xem React có gửi thiếu dữ liệu không (Validate)
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                // 2. Kiểm tra xem bác sĩ này đã có thông tin trong bảng Markdown chưa
                let markdown = await db.Markdown.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })

                if (markdown) {
                    // NẾU ĐÃ CÓ: Tiến hành Cập nhật (Update)
                    markdown.contentHTML = inputData.contentHTML;
                    markdown.contentMarkdown = inputData.contentMarkdown;
                    markdown.description = inputData.description;
                    await markdown.save();
                } else {
                    // NẾU CHƯA CÓ: Tiến hành Tạo mới (Create)
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succeed!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getInforDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            let doctor = await db.User.findOne({
                where: {
                    id: doctorId
                },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Markdown, as: 'markdownData' },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: false,
                nest: true
            })
            if (doctor && doctor.image) {
                doctor.image = new Buffer(doctor.image, 'base64').toString('binary');
            }
            resolve({
                errCode: 0,
                data: doctor
            })
        }
        catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getInforDoctorById: getInforDoctorById
}