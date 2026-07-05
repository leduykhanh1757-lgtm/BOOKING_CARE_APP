import React from 'react';
import InfoTemplate from './InfoTemplate';

const CorporateHealth = () => {
    return (
        <InfoTemplate title="Sức khỏe doanh nghiệp">
            <h3>1. Giải pháp y tế toàn diện cho Doanh nghiệp</h3>
            <p>BookingCare cung cấp giải pháp tổ chức khám sức khỏe định kỳ chuyên nghiệp, giúp doanh nghiệp tiết kiệm thời gian, tối ưu chi phí và đảm bảo quyền lợi sức khỏe tốt nhất cho cán bộ nhân viên.</p>

            <h3>2. Gói dịch vụ cung cấp</h3>
            <ul>
                <li>Khám sức khỏe định kỳ thông tư 14/BYT.</li>
                <li>Khám bệnh nghề nghiệp chuyên sâu.</li>
                <li>Thiết kế gói khám theo đặc thù ngành nghề và ngân sách.</li>
                <li>Tổ chức lấy mẫu xét nghiệm tận nơi tại văn phòng.</li>
            </ul>

            <h3>3. Liên hệ nhận báo giá</h3>
            <p>Hotline dành riêng cho Doanh nghiệp: <b>024-7301-2468 (Phím 2)</b>. Chúng tôi có mạng lưới đối tác là các bệnh viện lớn (Thu Cúc, MEDLATEC, Vinmec...) sẵn sàng phục vụ.</p>
        </InfoTemplate>
    );
}

export default CorporateHealth;