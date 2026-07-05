import React from 'react';
import InfoTemplate from './InfoTemplate';

const Role = () => {
    return (
        <InfoTemplate title="Vai trò của BookingCare">
            <h3>1. Vị thế của một nền tảng công nghệ kết nối</h3>
            <p>BookingCare <b>không phải là một cơ sở khám chữa bệnh</b>, chúng tôi không trực tiếp cung cấp dịch vụ y tế hay tham gia vào quá trình chẩn đoán, ra phác đồ điều trị của bác sĩ. Chúng tôi là Nền tảng Công nghệ, đóng vai trò "cầu nối" giúp việc tiếp cận dịch vụ y tế của bệnh nhân trở nên dễ dàng, minh bạch và hiệu quả hơn.</p>

            <h3>2. Trách nhiệm của BookingCare</h3>
            <ul>
                <li><b>Kiểm duyệt thông tin:</b> Đảm bảo tính chính xác, minh bạch của hệ thống dữ liệu y tế (danh sách bác sĩ, chuyên khoa, cơ sở y tế, bảng giá dịch vụ) trước khi hiển thị cho người dùng.</li>
                <li><b>Bảo vệ quyền lợi người bệnh:</b> Lắng nghe và tiếp nhận mọi phản hồi của bệnh nhân sau khi đi khám. Nếu có vấn đề phát sinh, chúng tôi sẽ đóng vai trò trung gian, phối hợp cùng cơ sở y tế để bảo vệ quyền lợi chính đáng của bệnh nhân.</li>
                <li><b>Cung cấp hạ tầng công nghệ:</b> Đảm bảo hệ thống máy chủ, website, ứng dụng đặt lịch vận hành ổn định 24/7, tuyệt đối bảo mật dữ liệu và thông tin cá nhân của người dùng.</li>
            </ul>

            <h3>3. Sứ mệnh của chúng tôi</h3>
            <p>Góp phần chuyển đổi số nền y tế Việt Nam, giải quyết bài toán ùn tắc tại các bệnh viện lớn, đồng thời mang đến một trải nghiệm chăm sóc sức khỏe an tâm, chủ động và toàn diện cho mọi người dân.</p>
        </InfoTemplate>
    );
}

export default Role;