require('dotenv').config();
import nodemailer from 'nodemailer';
const https = require('https');

// --- HÀM GỬI EMAIL CHÍNH: BREVO REST API KHÔNG PHỤ THUỘC THƯ VIỆN BÊN NGOÀI + FALLBACK NODEMAILER IPV4 ---
let sendBrevoRestApi = (apiKey, senderEmail, to, subject, html, attachments) => {
    return new Promise((resolve, reject) => {
        let payload = {
            sender: { name: "BookingCare", email: senderEmail },
            to: [{ email: to }],
            subject: subject,
            htmlContent: html,
        };

        if (attachments && attachments.length > 0) {
            payload.attachment = attachments.map(att => ({
                name: att.filename,
                content: att.content // base64 string
            }));
        }

        let data = JSON.stringify(payload);

        let req = https.request({
            hostname: 'api.brevo.com',
            path: '/v3/smtp/email',
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json',
                'content-length': Buffer.byteLength(data)
            },
            timeout: 10000
        }, (res) => {
            let resData = '';
            res.on('data', chunk => resData += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log("Sent email successfully via Brevo REST API:", resData);
                    resolve(true);
                } else {
                    console.error("Brevo API error status:", res.statusCode, resData);
                    reject(new Error(`Brevo API status ${res.statusCode}: ${resData}`));
                }
            });
        });

        req.on('error', (err) => {
            console.error("Brevo API request error:", err);
            reject(err);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error("Brevo API request timeout"));
        });

        req.write(data);
        req.end();
    });
};

let sendMailUnified = async ({ to, subject, html, attachments }) => {
    let apiKey = process.env.EMAIL_APP_PASSWORD || "";
    let senderEmail = process.env.EMAIL_APP || "leduykhanh1757@gmail.com";

    // 1. Thử gửi bằng Brevo REST API nếu có API Key (dạng xkeysib-...) hoặc khi được gọi
    if (apiKey && apiKey.startsWith("xkeysib-")) {
        try {
            await sendBrevoRestApi(apiKey, senderEmail, to, subject, html, attachments);
            return true;
        } catch (apiError) {
            console.error("Brevo REST API error, falling back to Nodemailer SMTP:", apiError.message);
        }
    }

    // 2. Dự phòng: Gửi qua Nodemailer SMTP (Ép dùng IPv4 theo yêu cầu)
    let host = process.env.EMAIL_HOST || "smtp-relay.brevo.com";
    let port = Number(process.env.EMAIL_PORT) || 587;

    let transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465,
        family: 4, // ⚡ ÉP CHỈ DÙNG IPV4
        auth: {
            user: senderEmail,
            pass: apiKey,
        },
        connectionTimeout: 10000,
    });

    let mailOptions = {
        from: `"BookingCare" <${senderEmail}>`,
        to: to,
        subject: subject,
        html: html,
    };

    if (attachments && attachments.length > 0) {
        mailOptions.attachments = attachments;
    }

    await transporter.sendMail(mailOptions);
    console.log("Sent email successfully via Nodemailer SMTP (IPv4)");
    return true;
};

// --- CÁC HÀM ĐẶT LỊCH KHM BỆNH & GÓI KHÁM ---
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
    try {
        let subjectTitle = dataSend.language === 'vi' ? "Thông tin đặt lịch khám bệnh | BookingCare" : "Information to book a medical appointment | BookingCare";
        await sendMailUnified({
            to: dataSend.receiverEmail,
            subject: subjectTitle,
            html: getBodyHTMLEmail(dataSend),
        });
        return true;
    } catch (e) {
        console.error("Error sendSimpleEmail:", e);
        throw e;
    }
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
            await sendMailUnified({
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
        } catch (e) {
            console.error("Error sendAttachment:", e);
            reject(e);
        }
    })
}

// --- CÁC HÀM CHO GÓI KHÁM ---
let getPackageEmailBody = (dataSend) => {
    let result = '';
    let isOnline = (dataSend.serviceType === 'remote-examination' || dataSend.serviceType === 'mental-health');

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
                <li><b>Scheduled Date:</b> ${dataSend.bookingDate}</li>
                <li><b>Phone Number:</b> ${dataSend.phoneNumber}</li>
                <li><b>Reason for visit:</b> ${dataSend.reason || 'None'}</li>
            </ul>
            ${instruction}
            <p>Thank you for trusting our services!</p>
        `;
    } else {
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
                <li><b>Ngày khám dự kiến:</b> ${dataSend.bookingDate}</li>
                <li><b>Số điện thoại:</b> ${dataSend.phoneNumber}</li>
                <li><b>Lý do khám:</b> ${dataSend.reason || 'Không có'}</li>
            </ul>
            ${instruction}
            <p>Xin chân thành cảm ơn quý khách đã tin tưởng!</p>
        `;
    }
    return result;
}

let sendPackageBookingEmail = async (dataSend) => {
    try {
        let subjectTitle = dataSend.language === 'en'
            ? "Medical Service Booking Confirmation | BookingCare"
            : "Xác nhận đặt lịch Dịch vụ Y tế thành công | BookingCare";

        await sendMailUnified({
            to: dataSend.email,
            subject: subjectTitle,
            html: getPackageEmailBody(dataSend),
        });
        return true;
    } catch (e) {
        console.error("Error sendPackageBookingEmail:", e);
        throw e;
    }
}

let sendForgotPasswordEmail = async (dataSend) => {
    try {
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

        await sendMailUnified({
            to: dataSend.email,
            subject: subjectTitle,
            html: bodyHtml,
        });
        return true;
    } catch (e) {
        console.error("Error sendForgotPasswordEmail:", e);
        throw e;
    }
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
    getPackageEmailBody: getPackageEmailBody,
    sendPackageBookingEmail: sendPackageBookingEmail,
    sendForgotPasswordEmail: sendForgotPasswordEmail
}