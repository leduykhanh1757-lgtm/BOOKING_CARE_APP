import React from 'react';
import InfoTemplate from './InfoTemplate';

const PrivacyPolicy = () => {
    return (
        <InfoTemplate title="Chính sách bảo mật">
            <h3>1. Mục đích và phạm vi thu thập</h3>
            <p>Việc thu thập dữ liệu chủ yếu trên nền tảng BookingCare bao gồm: email, điện thoại, tên đăng nhập, mật khẩu. Đây là các thông tin mà BookingCare cần người dùng cung cấp bắt buộc khi đăng ký sử dụng dịch vụ và để chúng tôi liên hệ xác nhận, nhằm đảm bảo quyền lợi tốt nhất cho người dùng.</p>

            <h3>2. Phạm vi sử dụng thông tin</h3>
            <p>Nền tảng BookingCare sử dụng thông tin người dùng cung cấp để:</p>
            <ul>
                <li>Cung cấp các dịch vụ, hỗ trợ đặt lịch khám y tế đến người dùng.</li>
                <li>Gửi các thông báo về các hoạt động trao đổi thông tin giữa người dùng và nền tảng (như nhắc lịch khám, kết quả xét nghiệm).</li>
                <li>Ngừa các hoạt động phá hủy tài khoản người dùng hoặc các hoạt động giả mạo.</li>
                <li>Liên lạc và giải quyết khiếu nại với người dùng trong những trường hợp đặc biệt.</li>
            </ul>

            <h3>3. Cam kết bảo mật thông tin cá nhân</h3>
            <p>Thông tin cá nhân của thành viên trên BookingCare được cam kết bảo mật tuyệt đối theo chính sách bảo vệ thông tin cá nhân của công ty. Việc thu thập và sử dụng thông tin của mỗi cá nhân chỉ được thực hiện khi có sự đồng ý của khách hàng đó, trừ những trường hợp pháp luật có quy định khác. Chúng tôi tuyệt đối không sử dụng, không chuyển giao hay tiết lộ cho bên thứ 3 nào về thông tin cá nhân của thành viên khi không có sự cho phép đồng ý từ người dùng.</p>
        </InfoTemplate>
    );
}

export default PrivacyPolicy;