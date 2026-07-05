import React from 'react';
import InfoTemplate from './InfoTemplate';

const ForPatients = () => {
    return (
        <InfoTemplate title="Dành cho Bệnh nhân">
            <h3>1. Đặt lịch khám dễ dàng, hoàn toàn MIỄN PHÍ</h3>
            <p>BookingCare cung cấp nền tảng tra cứu và đặt lịch khám bệnh trực tuyến hoàn toàn miễn phí cho người dùng. Bạn không phải trả thêm bất kỳ khoản phí trung gian nào khi đặt lịch qua hệ thống của chúng tôi. Giá khám được niêm yết minh bạch, cam kết bằng với giá niêm yết tại cơ sở y tế.</p>

            <h3>2. Thông tin Bác sĩ được xác thực 100%</h3>
            <p>Mọi thông tin về chuyên môn, quá trình công tác, kinh nghiệm điều trị của bác sĩ đều được đội ngũ BookingCare thẩm định chéo qua nhiều nguồn uy tín trước khi công bố. Bạn hoàn toàn yên tâm chọn đúng bác sĩ giỏi, đúng bệnh.</p>

            <h3>3. Hỗ trợ xuyên suốt quá trình đi khám</h3>
            <ul>
                <li>Nhắc lịch tự động qua SMS/Zalo giúp bạn không quên ngày giờ khám.</li>
                <li>Hướng dẫn chi tiết quy trình đi khám, vị trí bãi gửi xe, khu vực lấy số thứ tự tại từng bệnh viện.</li>
                <li>Đội ngũ CSKH sẵn sàng hỗ trợ đổi lịch, hủy lịch hoặc giải đáp thắc mắc qua tổng đài 24/7.</li>
                <li>Đánh giá trải nghiệm chân thực: Chỉ những bệnh nhân đã thực sự đi khám qua hệ thống mới được phép để lại phản hồi.</li>
            </ul>
        </InfoTemplate>
    );
}

export default ForPatients;