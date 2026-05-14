import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
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

let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Kiểm tra dữ liệu đầu vào
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let schedule = data.arrSchedule;

                // 2. Thêm các trường cần thiết nếu database yêu cầu (maxNumber...)
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                let existing = await db.Schedule.findAll({
                    where: {
                        doctorId: data.doctorId,
                        date: '' + data.formatedDate
                        // ép kiểu về String để so sánh chính xác
                        //  với dữ liệu mới (cũng đã được ép kiểu String)
                    },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });

                // ÉP KIỂU KHI SO SÁNH (Biến cả a và b thành String để so sánh chuẩn xác tuyệt đối)
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && '' + a.date === '' + b.date;
                });

                console.log(">>> [KIỂM TRA] Lịch MỚI TINH chuẩn bị lưu: ", toCreate);

                // Chỉ lưu mảng mới
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

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
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getInforDoctorById: getInforDoctorById,
    bulkCreateScheduleService: bulkCreateScheduleService,
}