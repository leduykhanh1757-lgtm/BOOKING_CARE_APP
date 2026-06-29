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
            // Kiểm tra xem User có gửi thiếu trường dữ liệu nào không
            if (!data.email || !data.doctorId || !data.timeType || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let user = await db.User.findOne({
                    where: { email: data.email }
                });

                if (!user) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Email chưa được đăng ký. Vui lòng đăng ký tài khoản trước khi đặt lịch!'
                    });
                }

                if (user) {
                    let token = uuidv4(); // 🛠️ SỬA LỖI: Sinh mã token chống hack

                    let [booking, created] = await db.Booking.findOrCreate({
                        where: {
                            patientId: user.id,
                            date: data.date,
                            timeType: data.timeType
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user.id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token // 🛠️ SỬA LỖI: Lưu token vào DB
                        }
                    });

                    if (created === true) {
                        // SỬA LỖI: Gửi đủ một đống đồ chơi này cho Nodemailer nó vẽ HTML
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

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}