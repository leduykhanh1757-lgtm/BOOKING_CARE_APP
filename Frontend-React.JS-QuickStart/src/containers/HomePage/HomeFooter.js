import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './HomeFooter.scss';

class HomeFooter extends Component {

    handleRedirect = (path) => {
        if (this.props.history) {
            this.props.history.push(path);
            window.scrollTo(0, 0);
        }
    }

    render() {
        return (
            <div className="home-footer-container">
                <div className="home-footer-content">

                    {/* CỘT 1: THÔNG TIN CÔNG TY */}
                    <div className="footer-col-1">
                        <h3>Công ty Cổ phần Công nghệ BookingCare</h3>
                        <ul>
                            <li><i className="fas fa-map-marker-alt"></i> Lô B4/D21, Khu đô thị mới Cầu Giấy, Phường Dịch Vọng Hậu, Hà Nội</li>
                            <li><i className="fas fa-check"></i> ĐKKD số: 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/2015</li>
                            <li><i className="fas fa-phone-alt"></i> 024-7301-2468 (7h30 - 18h)</li>
                            <li><i className="fas fa-envelope"></i> support@bookingcare.vn</li>
                        </ul>

                        <h4 className="office-title">Văn phòng tại TP Hồ Chí Minh</h4>
                        <ul>
                            <li><i className="fas fa-map-marker-alt"></i> Tòa nhà H3 Building, số 384 Hoàng Diệu, Phường 6, Quận 4, TP.HCM</li>
                        </ul>

                        <div className="footer-badges">
                            <a href="#" target="_blank" rel="noreferrer"><img src="https://bookingcare.vn/assets/icon/bo-cong-thuong.svg" alt="Bộ Công Thương" /></a>
                            <a href="#" target="_blank" rel="noreferrer"><img src="https://bookingcare.vn/assets/icon/bo-cong-thuong.svg" alt="Bộ Công Thương" /></a>
                        </div>
                    </div>

                    {/* CỘT 2: LOGO VÀ DANH SÁCH LINK */}
                    <div className="footer-col-2">
                        <div className="footer-logo" onClick={() => this.handleRedirect('/home')}></div>
                        <ul className="footer-links">
                            <li onClick={() => this.handleRedirect('/cooperation')}>Liên hệ hợp tác</li>
                            <li onClick={() => this.handleRedirect('/digital-transformation')}>Chuyển đổi số</li>
                            <li onClick={() => this.handleRedirect('/privacy-policy')}>Chính sách bảo mật</li>
                            <li onClick={() => this.handleRedirect('/regulations')}>Quy chế hoạt động</li>
                            <li onClick={() => this.handleRedirect('/recruitment')}>Tuyển dụng</li>
                            <li onClick={() => this.handleRedirect('/terms')}>Điều khoản sử dụng</li>
                            <li onClick={() => this.handleRedirect('/support')}>Câu hỏi thường gặp</li>
                        </ul>
                    </div>

                    {/* CỘT 3: ĐỐI TÁC BẢO TRỢ & MẠNG XÃ HỘI */}
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
                                <h4>Doctor Check</h4>
                                <p>Bảo trợ chuyên mục nội dung "Sức khỏe tổng quát"</p>
                            </div>
                        </div>

                        {/* Đã đưa Social App ra ngoài chuẩn HTML */}
                        <div className="footer-social-app">
                            <h4>Kết nối với chúng tôi</h4>
                            <div className="social-links">
                                <a href="https://www.facebook.com/bookingcare" target="_blank" rel="noreferrer" className="facebook"><i className="fab fa-facebook-square"></i></a>
                                <a href="https://www.youtube.com/channel/UC9l2RhMEPCIgDyGCH8ijtPQ" target="_blank" rel="noreferrer" className="youtube"><i className="fab fa-youtube"></i></a>
                            </div>
                        </div>
                    </div>

                </div>

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeFooter));