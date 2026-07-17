require('dotenv').config();
import nodemailer from 'nodemailer';

// --- CÁC HÀM CŨ CỦA ĐẶT LỊCH BÁC SĨ (GIỮ NGUYÊN) ---
let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên hệ thống BookingCare.</p>
        <p><b>Thông tin đặt lịch khám bệnh:</b></p>
        <div><b>Thời gian:</b> ${dataSend.time}</div>
        <div><b>Bác sĩ:</b> ${dataSend.doctorName}</div>
        <p>Nếu các thông tin trên là chính xác, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
        <div><a href="${dataSend.redirectLink}" target="_blank">Click vào đây để xác nhận</a></div>
        <div>Xin chân thành cảm ơn!</div>`;
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on the BookingCare system.</p>
        <p><b>Information to book a medical appointment:</b></p>
        <div><b>Time:</b> ${dataSend.time}</div>
        <div><b>Doctor:</b> ${dataSend.doctorName}</div>
        <p>If the above information is correct, please click on the link below to confirm and complete the procedure to book a medical appointment.</p>
        <div><a href="${dataSend.redirectLink}" target="_blank">Click here to confirm</a></div>
        <div>Sincerely thanks!</div>`;
    }
    return result;
}

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", port: 587, secure: false,
        auth: { user: process.env.EMAIL_APP, pass: process.env.EMAIL_APP_PASSWORD },
    });
    let subjectTitle = dataSend.language === 'vi' ? "Thông tin đặt lịch khám bệnh | BookingCare" : "Information to book a medical appointment | BookingCare";
    await transporter.sendMail({
        from: '"BookingCare LDK" <latla17572005@gmail.com>',
        to: dataSend.receiverEmail,
        subject: subjectTitle,
        html: getBodyHTMLEmail(dataSend),
    });
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `<h3>Xin chào ${dataSend.patientName}!</h3><p>Bạn nhận được email này vì đã hoàn tất khám bệnh trên hệ thống BookingCare.</p><p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm bên dưới.</p><div>Xin chân thành cảm ơn!</div>`;
    }
    if (dataSend.language === 'en') {
        result = `<h3>Dear ${dataSend.patientName}!</h3><p>You received this email because you have completed your medical examination on the BookingCare system.</p><p>Information about prescriptions/invoices is sent in the attached file below.</p><div>Sincerely thanks!</div>`;
    }
    return result;
}

let sendAttachment = (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com", port: 587, secure: false,
                auth: { user: process.env.EMAIL_APP, pass: process.env.EMAIL_APP_PASSWORD },
            });
            await transporter.sendMail({
                from: '"BookingCare LDK" <latla17572005@gmail.com>', // Đã cập nhật đúng mail gửi
                to: dataSend.email,
                subject: dataSend.language === 'vi' ? "Kết quả khám bệnh" : "Medical examination results",
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [{
                    filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                    content: dataSend.imgBase64.split("base64,")[1],
                    encoding: 'base64'
                }]
            });
            resolve(true);
        } catch (e) { reject(e); }
    })
}

// --- CÁC HÀM MỚI CHO GÓI KHÁM ĐÃ FIX ---
let getPackageEmailBody = (dataSend) => {
    let result = '';
    // Kiểm tra xem có phải là khám từ xa hay tư vấn tâm lý không
    let isOnline = (dataSend.serviceType === 'remote-examination' || dataSend.serviceType === 'mental-health');

    // ================= GIAO DIỆN TIẾNG ANH =================
    if (dataSend.language === 'en') {
        let instruction = isOnline
            ? `<h4><b style="color: #d93025;">IMPORTANT NOTE FOR ONLINE CONSULTATION:</b></h4>
               <p>Since this is a remote consultation, please access the virtual clinic link exactly at the scheduled time:</p>
               <p><b>🔗 Virtual Room Link (Zoom/Google Meet):</b> <a href="https://meet.google.com/abc-xyz-demo" target="_blank">Click here to join</a></p>
               <p><i>Please ensure a stable internet connection, use a headset, and sit in a quiet space.</i></p>`
            : `<h4><b style="color: #d93025;">NOTE FOR HOSPITAL VISIT:</b></h4>
               <p>Please arrive on time at the medical facility. Our customer service team will contact you shortly to confirm the exact schedule.</p>
               <p><i>* If your package includes Blood Tests or Endoscopy, please fast (only drink water) in the morning for the most accurate results.</i></p>`;

        result = `
            <h3>Dear ${dataSend.fullName}!</h3>
            <p>You received this email because you booked a Medical Service/Package on the BookingCare system.</p>
            <p><b>Your Booking Information:</b></p>
            <ul>
                <li><b>Service Name:</b> ${dataSend.packageName}</li>
                <li><b>Scheduled Date:</b> ${dataSend.bookingDate}</li> <!-- 🛠️ ĐÃ THÊM NGÀY KHÁM -->
                <li><b>Phone Number:</b> ${dataSend.phoneNumber}</li>
                <li><b>Reason for visit:</b> ${dataSend.reason || 'None'}</li>
            </ul>
            ${instruction}
            <p>Thank you for trusting our services!</p>
        `;
    }
    // ================= GIAO DIỆN TIẾNG VIỆT =================
    else {
        let instruction = isOnline
            ? `<h4><b style="color: #d93025;">LƯU Ý QUAN TRỌNG VỀ KHÁM TRỰC TUYẾN:</b></h4>
               <p>Vì đây là dịch vụ khám/tư vấn từ xa, quý khách vui lòng truy cập vào đường link phòng khám ảo vào đúng giờ hẹn:</p>
               <p><b>🔗 Link phòng khám (Zoom/Google Meet):</b> <a href="https://meet.google.com/abc-xyz-demo" target="_blank">Bấm vào đây để tham gia</a></p>
               <p><i>Vui lòng chuẩn bị kết nối mạng ổn định, tai nghe và ngồi ở không gian yên tĩnh.</i></p>`
            : `<h4><b style="color: #d93025;">LƯU Ý KHI ĐI KHÁM:</b></h4>
               <p>Vui lòng đến đúng giờ tại cơ sở y tế. Nhân viên CSKH sẽ liên hệ với quý khách để xác nhận lại thời gian chính xác.</p>
               <p><i>* Nếu gói khám có bao gồm Xét nghiệm máu hoặc Nội soi, quý khách vui lòng nhịn ăn sáng (chỉ uống nước lọc) để kết quả chính xác nhất.</i></p>`;

        result = `
            <h3>Xin chào ${dataSend.fullName}!</h3>
            <p>Bạn nhận được email này vì đã đặt lịch Gói khám/Dịch vụ y tế trên hệ thống BookingCare.</p>
            <p><b>Thông tin đặt lịch của bạn:</b></p>
            <ul>
                <li><b>Tên dịch vụ:</b> ${dataSend.packageName}</li>
                <li><b>Ngày khám dự kiến:</b> ${dataSend.bookingDate}</li> <!-- 🛠️ ĐÃ THÊM NGÀY KHÁM -->
                <li><b>Số điện thoại:</b> ${dataSend.phoneNumber}</li>
                <li><b>Lý do khám:</b> ${dataSend.reason || 'Không có'}</li>
            </ul>
            ${instruction}
            <p>Xin chân thành cảm ơn quý khách đã tin tưởng!</p>
        `;
    }
    return result;
}

// Hàm chính để gửi mail Gói Khám
let sendPackageBookingEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let subjectTitle = dataSend.language === 'en'
        ? "Medical Service Booking Confirmation | BookingCare"
        : "Xác nhận đặt lịch Dịch vụ Y tế thành công | BookingCare";

    await transporter.sendMail({
        from: '"BookingCare LDK" <latla17572005@gmail.com>',
        to: dataSend.email,
        subject: subjectTitle,
        html: getPackageEmailBody(dataSend),
    });
}

let sendForgotPasswordEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let subjectTitle = dataSend.language === 'en'
        ? "Reset Password Verification Code | BookingCare"
        : "Mã xác nhận Đặt lại mật khẩu | BookingCare";

    let bodyHtml = dataSend.language === 'en'
        ? `<h3>Dear User,</h3>
           <p>You requested a password reset on BookingCare. Your verification code is:</p>
           <h2 style="color: #d93025; font-size: 24px; padding: 10px; border: 1px solid #ccc; display: inline-block;">${dataSend.otp}</h2>
           <p>This code is valid for 5 minutes. If you did not request this, please ignore this email.</p>
           <p>Best regards!</p>`
        : `<h3>Xin chào,</h3>
           <p>Bạn đã yêu cầu đặt lại mật khẩu trên BookingCare. Mã xác nhận của bạn là:</p>
           <h2 style="color: #d93025; font-size: 24px; padding: 10px; border: 1px solid #ccc; display: inline-block;">${dataSend.otp}</h2>
           <p>Mã này có hiệu lực trong 5 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
           <p>Trân trọng!</p>`;

    await transporter.sendMail({
        from: '"BookingCare LDK" <latla17572005@gmail.com>',
        to: dataSend.email,
        subject: subjectTitle,
        html: bodyHtml,
    });
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
    getPackageEmailBody: getPackageEmailBody,
    sendPackageBookingEmail: sendPackageBookingEmail,
    sendForgotPasswordEmail: sendForgotPasswordEmail
}