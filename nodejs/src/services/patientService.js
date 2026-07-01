import db from "../models/index";
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config(); // 🛠️ Phải có dòng này để load biến URL_REACT

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Kiểm tra validate theo chuẩn video (thêm fullName, selectedGender, address...)
            if (!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.fullName || !data.selectedGender || !data.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let token = uuidv4();

                // 2. TÌM HOẶC TẠO MỚI BỆNH NHÂN (Find or Create)
                // Nếu email đã tồn tại thì lấy user đó, nếu chưa có thì tạo mới với role R3
                let [user, created] = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3', // R3 là quyền Bệnh nhân
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName,
                        phoneNumber: data.phoneNumber ? data.phoneNumber : ''
                    },
                });

                // 3. TẠO LỊCH HẸN (BOOKING) VÀO DATABASE
                if (user) {
                    let [booking, isCreated] = await db.Booking.findOrCreate({
                        where: {
                            patientId: user.id,
                            date: data.date,
                            timeType: data.timeType
                        },
                        defaults: {
                            statusId: 'S1', // S1: Trạng thái lịch hẹn mới (New)
                            doctorId: data.doctorId,
                            patientId: user.id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    });

                    // 4. GỬI EMAIL XÁC NHẬN CHO BỆNH NHÂN
                    if (isCreated) {
                        await emailService.sendSimpleEmail({
                            receiverEmail: data.email,
                            patientName: data.fullName,
                            time: data.timeString,
                            doctorName: data.doctorName,
                            language: data.language,
                            redirectLink: buildUrlEmail(data.doctorId, token)
                        });
                    }
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save info patient successfully!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Check xem có bị gửi thiếu data không
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                // 2. Mò vào Database tìm cái lịch khám khớp token, khớp bác sĩ và phải đang ở trạng thái S1
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false // 🛠️ Bắt buộc phải có dòng này để lát nữa dùng được hàm .save()
                });

                // 3. Nếu tìm thấy -> Cập nhật thành S2
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment status successfully!'
                    })
                } else {
                    // 4. Nếu không tìm thấy (hoặc do status đã là S2 từ trước rồi)
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getListPatientForDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let dataPatient = await db.Booking.findAll({
                    where: {
                        statusId: 'S2', // S2 là trạng thái "Đã xác nhận"
                        doctorId: data.doctorId,
                        date: data.date
                    },
                    include: [
                        {
                            model: db.User, as: 'patientData', // Thông tin bệnh nhân
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataPatient', // Thông tin thời gian khám
                            attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true,

                })

                resolve({
                    errCode: 0,
                    data: dataPatient
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getListPatientForDoctor: getListPatientForDoctor
}