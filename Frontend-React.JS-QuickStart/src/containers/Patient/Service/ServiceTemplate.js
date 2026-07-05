import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './ServiceTemplate.scss';

class ServiceTemplate extends Component {
    render() {
        // Nhận tiêu đề và mô tả từ ngoài truyền vào để tái sử dụng
        let { title, description, bannerImage } = this.props;

        return (
            <div className="service-template-container">
                <HomeHeader isShowBanner={false} />

                {/* Banner riêng của từng Dịch vụ */}
                <div className="service-banner" style={{ backgroundImage: `url(${bannerImage || 'https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg'})` }}>
                    <div className="banner-overlay">
                        <div className="banner-content">
                            <h2>{title || "Tên dịch vụ"}</h2>
                            <p>{description || "Mô tả chi tiết về dịch vụ này"}</p>
                        </div>
                    </div>
                </div>

                {/* Phần thân chứa danh sách (Mock data) */}
                <div className="service-body">
                    <div className="service-intro">
                        <h3>Danh sách nổi bật</h3>
                        <p>Lựa chọn các dịch vụ uy tín được BookingCare xác thực.</p>
                    </div>

                    {/* Khối Card giả lập - Sau này thay bằng hàm map() gọi API */}
                    <div className="service-list">
                        <div className="service-card">
                            <div className="card-left">
                                <div className="card-avatar"></div>
                            </div>
                            <div className="card-right">
                                <h4>Phòng khám / Bác sĩ Test 1</h4>
                                <div className="card-desc">Chuyên môn cao, dịch vụ tận tình, có hỗ trợ BHYT.</div>
                                <div className="card-location"><i className="fas fa-map-marker-alt"></i> Quận Đống Đa, Hà Nội</div>
                                <button className="btn-detail">Xem chi tiết</button>
                            </div>
                        </div>

                        <div className="service-card">
                            <div className="card-left">
                                <div className="card-avatar"></div>
                            </div>
                            <div className="card-right">
                                <h4>Phòng khám / Bác sĩ Test 2</h4>
                                <div className="card-desc">Cơ sở vật chất hiện đại, đặt lịch nhanh chóng không chờ đợi.</div>
                                <div className="card-location"><i className="fas fa-map-marker-alt"></i> Quận Cầu Giấy, Hà Nội</div>
                                <button className="btn-detail">Xem chi tiết</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => { return {}; };
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(ServiceTemplate);