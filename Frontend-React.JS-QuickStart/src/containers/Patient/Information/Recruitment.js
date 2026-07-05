import React from 'react';
import InfoTemplate from './InfoTemplate';

const Recruitment = () => {
    return (
        <InfoTemplate title="Tuyển dụng Nhân tài">
            <h3>1. Môi trường làm việc tại BookingCare</h3>
            <p>Chúng tôi là một đội ngũ trẻ, đam mê công nghệ và khao khát tạo ra những tác động tích cực cho nền y tế nước nhà. Tại BookingCare, mỗi cá nhân đều được trao quyền, khuyến khích sáng tạo và phát triển không giới hạn. Tôn chỉ của chúng tôi là: <b>"Công nghệ vị nhân sinh"</b>.</p>

            <h3>2. Các vị trí đang mở tuyển (Cập nhật tháng này)</h3>
            <ul>
                <li><b>Frontend Developer (ReactJS/VueJS):</b> Tham gia phát triển và tối ưu UI/UX cho hệ thống đặt lịch lõi. Yêu cầu 1-2 năm kinh nghiệm.</li>
                <li><b>Backend Developer (Node.js/Python):</b> Thiết kế kiến trúc Microservices, chịu trách nhiệm xử lý hàng chục ngàn truy vấn đồng thời.</li>
                <li><b>Chuyên viên Phát triển đối tác (B2B Sales):</b> Tiếp cận và thuyết phục các Bệnh viện, Phòng khám tham gia vào nền tảng.</li>
                <li><b>Chăm sóc khách hàng (CSKH):</b> Hỗ trợ bệnh nhân đặt lịch, giải đáp thắc mắc và xử lý sự cố trực tuyến.</li>
            </ul>

            <h3>3. Chế độ đãi ngộ & Phúc lợi</h3>
            <p>Mức lương cạnh tranh, xét tăng lương 2 lần/năm. Đầy đủ các chế độ BHYT, BHXH theo luật định. Đặc biệt, nhân viên và người thân được hưởng gói chăm sóc sức khỏe toàn diện từ các đối tác y tế hàng đầu của BookingCare.</p>

            <p>Ứng viên quan tâm vui lòng gửi CV về địa chỉ: <b>tuyendung@bookingcare.vn</b> với tiêu đề: <i>[Vị trí ứng tuyển] - [Họ và tên]</i>.</p>
        </InfoTemplate>
    );
}

export default Recruitment;