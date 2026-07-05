import React from 'react';
import InfoTemplate from './InfoTemplate';

const TermsOfUse = () => {
    return (
        <InfoTemplate title="Điều khoản sử dụng">
            <h3>1. Chấp nhận điều khoản</h3>
            <p>Bằng việc sử dụng nền tảng BookingCare, bạn đồng ý tuân thủ các điều khoản và điều kiện dưới đây. Nếu bạn không đồng ý, vui lòng ngừng sử dụng dịch vụ.</p>

            <h3>2. Quyền và Trách nhiệm của Bệnh nhân</h3>
            <ul>
                <li>Cung cấp thông tin cá nhân và tình trạng bệnh lý trung thực.</li>
                <li>Tuân thủ thời gian đặt lịch khám.</li>
                <li>Thanh toán đầy đủ các khoản phí dịch vụ y tế.</li>
            </ul>

            <h3>3. Miễn trừ trách nhiệm</h3>
            <p>BookingCare đóng vai trò là nền tảng kết nối, chúng tôi không can thiệp vào phác đồ điều trị của Bác sĩ và Cơ sở y tế.</p>
        </InfoTemplate>
    );
}

export default TermsOfUse;