import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './MedicalTest.scss';

class MedicalTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Mock data các gói xét nghiệm tiêu biểu
            listMedicalTests: [
                { id: 1, name: "Xét nghiệm Tổng quát Cơ bản", provider: "Trung tâm Xét nghiệm MEDLATEC", price: "799.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 2, name: "Tầm soát Dấu ấn Ung thư Nam/Nữ", provider: "Hệ thống Y tế Thu Cúc", price: "1.250.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 3, name: "Xét nghiệm NIPT cho Mẹ bầu", provider: "Trung tâm Xét nghiệm GENOLAB", price: "3.500.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 4, name: "Xét nghiệm ADN Huyết thống", provider: "Viện Công nghệ Sinh học ADN", price: "2.500.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 5, name: "Kiểm tra Chức năng Gan - Thận", provider: "Phòng khám Vietlife", price: "550.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 6, name: "Xét nghiệm Ký sinh trùng (Giun sán)", provider: "Bệnh viện Bệnh Nhiệt đới", price: "850.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
            ]
        }
    }

    handleViewDetail = (item) => {
        alert(`Bác đang xem chi tiết gói: ${item.name}`);
    }

    render() {
        let { listMedicalTests } = this.state;

        return (
            <div className="medical-test-container">
                <HomeHeader isShowBanner={false} />

                {/* KHỐI 1: BANNER XÉT NGHIỆM */}
                <div className="medical-banner">
                    <div className="banner-overlay">
                        <div className="banner-content">
                            <h2>Xét nghiệm Y học & Lấy mẫu tại nhà</h2>
                            <p>Nhanh chóng - Chính xác - Bảo mật. Hỗ trợ lấy mẫu tận nơi, trả kết quả Online tiện lợi.</p>
                        </div>
                    </div>
                </div>

                <div className="medical-body">
                    {/* KHỐI 2: ƯU ĐIỂM DỊCH VỤ */}
                    <div className="features-section">
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-vial"></i></div>
                            <div className="feature-text">
                                <h4>Đa dạng dịch vụ</h4>
                                <p>Hàng trăm danh mục xét nghiệm từ cơ bản đến chuyên sâu.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-ambulance"></i></div>
                            <div className="feature-text">
                                <h4>Lấy mẫu tận nơi</h4>
                                <p>Nhân viên y tế đến tận nhà lấy máu, tiết kiệm thời gian chờ đợi.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-file-medical-alt"></i></div>
                            <div className="feature-text">
                                <h4>Kết quả trực tuyến</h4>
                                <p>Tra cứu kết quả dễ dàng qua tin nhắn SMS, Zalo hoặc Email.</p>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI 3: DANH SÁCH GÓI XÉT NGHIỆM */}
                    <div className="test-packages-section">
                        <h3 className="section-title">Các gói xét nghiệm nổi bật</h3>
                        <div className="packages-grid">
                            {listMedicalTests && listMedicalTests.length > 0 &&
                                listMedicalTests.map((item, index) => {
                                    return (
                                        <div
                                            className="package-card"
                                            key={index}
                                            onClick={() => this.handleViewDetail(item)}
                                        >
                                            <div
                                                className="card-image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            >
                                                <div className="tag-home-service">Có lấy mẫu tại nhà</div>
                                            </div>
                                            <div className="card-info">
                                                <h4 className="pkg-name">{item.name}</h4>
                                                <div className="pkg-provider">
                                                    <i className="far fa-hospital"></i> {item.provider}
                                                </div>
                                                <div className="pkg-bottom">
                                                    <div className="pkg-price">{item.price}</div>
                                                    <button className="btn-book">Chi tiết</button>
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
export default connect(mapStateToProps, mapDispatchToProps)(MedicalTest);