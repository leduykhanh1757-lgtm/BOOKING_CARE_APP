import React from 'react';
import InfoTemplate from './InfoTemplate';

const Regulations = () => {
    return (
        <InfoTemplate title="Quy chế hoạt động">
            <h3>1. Nguyên tắc chung</h3>
            <p>Nền tảng BookingCare do Công ty Cổ phần Công nghệ BookingCare sở hữu và vận hành. Nền tảng phục vụ các cá nhân, tổ chức có nhu cầu tìm kiếm thông tin y tế, đặt lịch khám bệnh trực tuyến.</p>

            <h3>2. Quy định về giá dịch vụ</h3>
            <p>Giá khám, dịch vụ niêm yết trên BookingCare là giá do Cơ sở y tế/Bác sĩ cung cấp. BookingCare cam kết không thu thêm bất kỳ khoản phụ phí đặt lịch nào từ phía người bệnh.</p>

            <h3>3. Cơ chế giải quyết tranh chấp</h3>
            <p>Khi phát sinh khiếu nại liên quan đến chất lượng khám chữa bệnh, BookingCare sẽ đóng vai trò trung gian, tiếp nhận thông tin từ bệnh nhân và chuyển tới Cơ sở y tế để yêu cầu giải quyết theo đúng quy định của pháp luật và Bộ Y tế.</p>
        </InfoTemplate>
    );
}

export default Regulations;