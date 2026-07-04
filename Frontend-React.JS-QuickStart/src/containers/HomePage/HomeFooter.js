import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeFooter.scss';

class HomeFooter extends Component {
    render() {
        return (
            <div className="home-footer-container">
                <div className="home-footer-content">

                    {/* CỘT 1: THÔNG TIN CÔNG TY (Chiếm 40%) */}
                    <div className="footer-col-1">
                        <h3>Công ty Cổ phần Công nghệ BookingCare</h3>
                        <ul>
                            <li><i className="fas fa-map-marker-alt"></i> Lô B4/D21, Khu đô thị mới Cầu Giấy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Thành phố Hà Nội</li>
                            <li><i className="fas fa-check"></i> ĐKKD số: 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/2015</li>
                            <li><i className="fas fa-phone-alt"></i> 024-7301-2468 (7h30 - 18h)</li>
                            <li><i className="fas fa-envelope"></i> support@bookingcare.vn (7h30 - 18h)</li>
                        </ul>
                        <h4>Văn phòng tại TP Hồ Chí Minh</h4>
                        <ul>
                            <li><i className="fas fa-map-marker-alt"></i> Tòa nhà H3 Building, số 384 Hoàng Diệu, Phường 6, Quận 4, TP.HCM</li>
                        </ul>
                        <div className="footer-badges">
                            {/* Lấy tạm ảnh huy hiệu Bộ Công Thương từ trang chủ thật */}
                            <img src="https://bookingcare.vn/assets/icon/bo-cong-thuong.svg" alt="Bộ Công Thương" />
                        </div>
                    </div>

                    {/* CỘT 2: LOGO VÀ DANH SÁCH LINK (Chiếm 25%) */}
                    <div className="footer-col-2">
                        <div className="footer-logo"></div>
                        <ul>
                            <li><a href="#">Liên hệ hợp tác</a></li>
                            <li><a href="#">Chuyển đổi số</a></li>
                            <li><a href="#">Chính sách bảo mật</a></li>
                            <li><a href="#">Quy chế hoạt động</a></li>
                            <li><a href="#">Tuyển dụng</a></li>
                            <li><a href="#">Điều khoản sử dụng</a></li>
                            <li><a href="#">Câu hỏi thường gặp</a></li>
                        </ul>
                    </div>

                    {/* CỘT 3: ĐỐI TÁC BẢO TRỢ NỘI DUNG (Chiếm 35%) */}
                    <div className="footer-col-3">
                        <h3>Đối tác bảo trợ nội dung</h3>
                        <div className="partner-item">
                            <div className="partner-logo hellodoctor"></div>
                            <div className="partner-info">
                                <h4>Hello Doctor</h4>
                                <p>Bảo trợ chuyên mục nội dung "Sức khỏe tinh thần"</p>
                            </div>
                        </div>
                        <div className="partner-item">
                            <div className="partner-logo bernard"></div>
                            <div className="partner-info">
                                <h4>Hệ thống y khoa chuyên sâu quốc tế Bernard</h4>
                                <p>Bảo trợ chuyên mục nội dung "Y khoa chuyên sâu"</p>
                            </div>
                        </div>
                        <div className="partner-item">
                            <div className="partner-logo doctorcheck"></div>
                            <div className="partner-info">
                                <h4>Doctor Check - Tầm Soát Bệnh Để Sống Thọ Hơn</h4>
                                <p>Bảo trợ chuyên mục nội dung "Sức khỏe tổng quát"</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* PHẦN DƯỚI CÙNG: BẢN QUYỀN */}
                <div className="home-sub-footer">
                    <p>
                        &copy; 2026 Lê Duy Khánh. All rights reserved.
                        <a target="_blank" rel="noreferrer" href="https://github.com/">
                            &#8594; Tham khảo thêm tại GitHub &#8592;
                        </a>
                    </p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => { return {}; };
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);