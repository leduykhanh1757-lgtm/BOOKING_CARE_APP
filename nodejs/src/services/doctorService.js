import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from '../services/emailService';

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
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Infor,
                        attributes: ['specialtyId'],
                        include: [
                            { model: db.Specialty, as: 'specialtyData', attributes: ['name'] }
                        ]
                    }
                ],
                raw: true,
                nest: true
            })

            if (users && users.length > 0) {
                users = users.map(item => {
                    if (item.image) {
                        item.image = Buffer.from(item.image, 'base64').toString('binary'); // 🛠️ Sửa chỗ này
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

let checkRequiredFields = (inputData, arrFields) => {
    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }
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
            // 1. Khai báo danh sách các trường bắt buộc phải có
            let arrCheck = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'specialtyId', 'clinicId'];

            // 2. Ném vào hàm helper để nó tự động quét
            let checkObj = checkRequiredFields(inputData, arrCheck);

            // 3. Nếu hàm trả về isValid = false -> Báo lỗi ngay
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}` // 🛠️ Báo rõ tên biến bị thiếu
                })
            } else {
                // ========================================================
                // XỬ LÝ BẢNG MARKDOWN 
                // ========================================================
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                } else if (inputData.action === 'EDIT') {
                    let markdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (markdown) {
                        markdown.contentHTML = inputData.contentHTML;
                        markdown.contentMarkdown = inputData.contentMarkdown;
                        markdown.description = inputData.description;
                        await markdown.save();
                    }
                }

                // ========================================================
                // XỬ LÝ BẢNG DOCTOR_INFOR 
                // ========================================================
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })

                if (doctorInfor) {
                    // Đã có -> Cập nhật (Upsert)
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    doctorInfor.specialtyId = inputData.specialtyId;
                    doctorInfor.clinicId = inputData.clinicId;
                    await doctorInfor.save();
                } else {
                    // Chưa có -> Tạo mới (Upsert)
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save info doctor succeed!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getInforDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            as: 'markdownData',
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
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
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getExtraInforDoctorById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: idInput
                    },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getProfileDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            as: 'markdownData',
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary'); // 🛠️ Sửa chỗ này
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType || !data.imgBase64) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                // 1. Cập nhật trạng thái Booking S2 -> S3
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false // Bắt buộc raw: false để dùng hàm save()
                });

                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save();
                }

                // 2. Gửi email đính kèm hóa đơn
                await emailService.sendAttachment(data);

                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let createNewComment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.content) {
                resolve({ errCode: 1, errMessage: 'Missing parameter' });
            } else {
                await db.Comment.create({
                    doctorId: data.doctorId,
                    authorName: data.authorName || 'Khách viếng thăm',
                    authorAvatar: data.authorAvatar,
                    content: data.content
                });
                resolve({ errCode: 0, errMessage: 'Create comment succeed!' });
            }
        } catch (e) { reject(e); }
    });
}

let getCommentsByDoctorId = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({ errCode: 1, errMessage: 'Missing parameters!' });
            } else {
                let comments = await db.Comment.findAll({
                    where: { doctorId: doctorId },
                    order: [['createdAt', 'DESC']], // Sắp xếp bình luận mới nhất lên đầu
                    raw: true
                });
                if (comments && comments.length > 0) {
                    comments = comments.map(item => {
                        // ✅ Cột authorAvatar là BLOB -> Sequelize trả về Buffer.
                        // Chỉ cần chuyển Buffer -> string (utf8), không decode base64 thêm.
                        if (item.authorAvatar && Buffer.isBuffer(item.authorAvatar)) {
                            item.authorAvatar = item.authorAvatar.toString('utf8');
                        }
                        return item;
                    });
                }

                resolve({ errCode: 0, data: comments });
            }
        } catch (e) {
            reject(e);
        }
    });
}
let toggleLikeDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.patientId) {
                resolve({ errCode: 1, errMessage: 'Missing parameter' });
            } else {
                // Kiểm tra xem user này đã like bác sĩ này chưa
                let existingLike = await db.Like.findOne({
                    where: { doctorId: data.doctorId, patientId: data.patientId }
                });

                if (existingLike) {
                    // Nếu đã Like rồi -> Bấm lần nữa là Hủy Like (Xóa record)
                    await existingLike.destroy();
                    resolve({ errCode: 0, errMessage: 'Unliked', isLiked: false });
                } else {
                    // Nếu chưa Like -> Tạo record mới
                    await db.Like.create({
                        doctorId: data.doctorId,
                        patientId: data.patientId
                    });
                    resolve({ errCode: 0, errMessage: 'Liked', isLiked: true });
                }
            }
        } catch (e) { reject(e); }
    });
}

let getLikesByDoctorId = (doctorId, patientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({ errCode: 1, errMessage: 'Missing parameter' });
            } else {
                // Đếm tổng số Like của Bác sĩ
                let totalLikes = await db.Like.count({ where: { doctorId: doctorId } });

                // Kiểm tra xem User hiện tại đã Like chưa
                let isLiked = false;
                if (patientId) {
                    let check = await db.Like.findOne({ where: { doctorId: doctorId, patientId: patientId } });
                    if (check) isLiked = true;
                }

                resolve({ errCode: 0, errMessage: 'Ok', data: { totalLikes, isLiked } });
            }
        } catch (e) { reject(e); }
    });
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getInforDoctorById: getInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getExtraInforDoctorById: getExtraInforDoctorById,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleByDate: getScheduleByDate,
    sendRemedy: sendRemedy,
    createNewComment: createNewComment,
    getCommentsByDoctorId: getCommentsByDoctorId,
    toggleLikeDoctor: toggleLikeDoctor,
    getLikesByDoctorId: getLikesByDoctorId
}