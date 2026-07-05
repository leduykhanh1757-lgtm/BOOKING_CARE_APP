import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './AllPackage.scss';

class AllPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Mock data các gói khám tổng quát
            listPackages: [
                { id: 1, name: "Gói khám Sức khỏe Tổng quát Cơ bản", clinic: "Bệnh viện Đa khoa Quốc tế Thu Cúc", price: "2.000.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 2, name: "Gói khám Tầm soát Ung thư Toàn diện Nam", clinic: "Hệ thống Y tế MEDLATEC", price: "3.500.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 3, name: "Gói khám Tầm soát Ung thư Toàn diện Nữ", clinic: "Hệ thống Y tế MEDLATEC", price: "4.200.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 4, name: "Gói Khám Sức khỏe Tiền hôn nhân", clinic: "Phòng khám Đa khoa Vietlife", price: "1.850.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 5, name: "Gói Tầm soát Bệnh lý Tim mạch", clinic: "Bệnh viện Đa khoa Tâm Anh", price: "2.800.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 6, name: "Gói Khám Tổng quát Nâng cao VIP", clinic: "Bệnh viện Quốc tế Vinmec", price: "8.500.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
            ]
        }
    }

    handleViewDetail = (item) => {
        alert(`Bác đang xem chi tiết gói: ${item.name}`);
    }

    render() {
        let { listPackages } = this.state;

        return (
            <div className="all-package-container">
                <HomeHeader isShowBanner={false} />

                {/* KHỐI 1: BANNER ĐỒNG BỘ CHUẨN XỊN */}
                <div className="package-banner">
                    <div className="banner-overlay">
                        <div className="banner-content">
                            <h2>Gói khám sức khỏe tổng quát</h2>
                            <p>Các gói khám được thiết kế khoa học, phù hợp với từng độ tuổi, giới tính và nhu cầu bảo vệ sức khỏe.</p>
                        </div>
                    </div>
                </div>

                <div className="package-body">
                    {/* KHỐI 2: ƯU ĐIỂM KHI KHÁM THEO GÓI */}
                    <div className="features-section">
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-stethoscope"></i></div>
                            <div className="feature-text">
                                <h4>Thiết kế khoa học</h4>
                                <p>Danh mục khám chi tiết, tối ưu chi phí và không phát sinh xét nghiệm thừa.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-hospital-alt"></i></div>
                            <div className="feature-text">
                                <h4>Cơ sở uy tín</h4>
                                <p>Hợp tác với các Bệnh viện, Phòng khám Đa khoa hàng đầu trên cả nước.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-clipboard-check"></i></div>
                            <div className="feature-text">
                                <h4>Tiết kiệm thời gian</h4>
                                <p>Đặt lịch trước, ưu tiên tiếp đón, giảm thiểu tối đa thời gian chờ đợi.</p>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI 3: DANH SÁCH GÓI KHÁM */}
                    <div className="package-services-section">
                        <h3 className="section-title">Danh sách Gói khám nổi bật</h3>
                        <div className="services-grid">
                            {listPackages && listPackages.length > 0 &&
                                listPackages.map((item, index) => {
                                    return (
                                        <div
                                            className="service-card"
                                            key={index}
                                            onClick={() => this.handleViewDetail(item)}
                                        >
                                            <div
                                                className="card-image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            >
                                                <div className="tag-hot">Được quan tâm</div>
                                            </div>
                                            <div className="card-info">
                                                <h4 className="srv-name">{item.name}</h4>
                                                <div className="srv-clinic">
                                                    <i className="far fa-hospital"></i> {item.clinic}
                                                </div>
                                                <div className="srv-bottom">
                                                    <div className="srv-price">{item.price}</div>
                                                    <button className="btn-book">Xem chi tiết</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => { return {}; };
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(AllPackage);