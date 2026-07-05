import React from 'react';
import InfoTemplate from './InfoTemplate';

const Contact = () => {
    return (
        <InfoTemplate title="Thông tin liên hệ">
            <h3>Công ty Cổ phần Công nghệ BookingCare</h3>
            <p>BookingCare là Nền tảng Y tế Chăm sóc sức khỏe toàn diện, kết nối người dùng với các dịch vụ y tế uy tín, chất lượng cao.</p>

            <h3>Trụ sở chính (Hà Nội)</h3>
            <ul>
                <li><b>Địa chỉ:</b> Lô B4/D21, Khu đô thị mới Cầu Giấy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Thành phố Hà Nội.</li>
                <li><b>Điện thoại:</b> 024-7301-2468 (Hỗ trợ từ 7h30 - 18h00, Thứ 2 đến Thứ 7).</li>
                <li><b>Email hỗ trợ:</b> support@bookingcare.vn</li>
            </ul>

            <h3>Văn phòng đại diện (TP. Hồ Chí Minh)</h3>
            <ul>
                <li><b>Địa chỉ:</b> Tòa nhà H3 Building, số 384 Hoàng Diệu, Phường 6, Quận 4, TP.HCM.</li>
            </ul>
        </InfoTemplate>
    );
}

export default Contact;