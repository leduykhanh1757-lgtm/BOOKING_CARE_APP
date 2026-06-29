require('dotenv').config();
import nodemailer from 'nodemailer';

// Hàm phụ trợ giúp render giao diện HTML cho Email (Giữ nguyên như cũ)
let getBodyHTMLEmail = (dataSend) => {
    let result = '';

    // Giao diện Tiếng Việt
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên hệ thống BookingCare.</p>
        <p><b>Thông tin đặt lịch khám bệnh:</b></p>
        <div><b>Thời gian:</b> ${dataSend.time}</div>
        <div><b>Bác sĩ:</b> ${dataSend.doctorName}</div>

        <p>Nếu các thông tin trên là chính xác, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
        <div>
            <a href="${dataSend.redirectLink}" target="_blank">Click vào đây để xác nhận</a>
        </div>
        
        <div>Xin chân thành cảm ơn!</div>
        `;
    }

    // Giao diện Tiếng Anh
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on the BookingCare system.</p>
        <p><b>Information to book a medical appointment:</b></p>
        <div><b>Time:</b> ${dataSend.time}</div>
        <div><b>Doctor:</b> ${dataSend.doctorName}</div>

        <p>If the above information is correct, please click on the link below to confirm and complete the procedure to book a medical appointment.</p>
        <div>
            <a href="${dataSend.redirectLink}" target="_blank">Click here to confirm</a>
        </div>
        
        <div>Sincerely thanks!</div>
        `;
    }

    return result;
}

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // BƯỚC MỚI: Bắt điều kiện để dịch Tiêu đề Email (Subject)
    let subjectTitle = '';
    if (dataSend.language === 'vi') {
        subjectTitle = "Thông tin đặt lịch khám bệnh | BookingCare";
    }
    if (dataSend.language === 'en') {
        subjectTitle = "Information to book a medical appointment | BookingCare";
    }

    // Thiết lập nội dung email
    let info = await transporter.sendMail({
        from: '"BookingCare LDK" <latla17572005@gmail.com>',
        to: dataSend.receiverEmail,
        subject: subjectTitle, // Truyền cái biến tiêu đề vừa dịch vào đây
        html: getBodyHTMLEmail(dataSend),
    });
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail
}