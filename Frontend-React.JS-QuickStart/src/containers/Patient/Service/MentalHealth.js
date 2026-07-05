import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './MentalHealth.scss';

class MentalHealth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Mock data các dịch vụ Tâm lý - Tâm thần
            listMentalServices: [
                { id: 1, name: "Tư vấn Tâm lý: Trầm cảm, Lo âu", expert: "Chuyên gia Tâm lý Trần Thu A", price: "500.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg", type: "Video/Trực tiếp" },
                { id: 2, name: "Khám & Điều trị Rối loạn giấc ngủ", expert: "Bác sĩ CKII Nguyễn Văn B", price: "400.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg", type: "Trực tiếp" },
                { id: 3, name: "Trị liệu Tâm lý Cặp đôi & Gia đình", expert: "Trung tâm Tâm lý trị liệu NHC", price: "1.000.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg", type: "Trực tiếp" },
                { id: 4, name: "Test Tâm lý / Bài trắc nghiệm", expert: "Phòng khám Tâm thần kinh Yên Hòa", price: "300.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg", type: "Video/Trực tiếp" },
                { id: 5, name: "Giải tỏa Căng thẳng (Stress & Burnout)", expert: "Chuyên gia Tâm lý Lê Hoàng C", price: "450.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg", type: "Video Call" },
                { id: 6, name: "Tư vấn Tâm lý Học đường cho trẻ", expert: "Viện Tâm lý Giáo dục BrainCare", price: "600.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg", type: "Trực tiếp" },
            ]
        }
    }

    handleViewDetail = (item) => {
        alert(`Bác đang xem thông tin chuyên gia: ${item.name}`);
    }

    render() {
        let { listMentalServices } = this.state;

        return (
            <div className="mental-health-container">
                <HomeHeader isShowBanner={false} />

                {/* KHỐI 1: BANNER TÂM LÝ */}
                <div className="mental-banner">
                    <div className="banner-overlay">
                        <div className="banner-content">
                            <h2>Sức khỏe Tinh thần & Trị liệu Tâm lý</h2>
                            <p>Lắng nghe, thấu hiểu và đồng hành cùng bạn. Cam kết bảo mật thông tin tuyệt đối.</p>
                        </div>
                    </div>
                </div>

                <div className="mental-body">
                    {/* KHỐI 2: CAM KẾT DỊCH VỤ */}
                    <div className="features-section">
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-user-shield"></i></div>
                            <div className="feature-text">
                                <h4>Bảo mật tuyệt đối</h4>
                                <p>Thông tin cá nhân và hồ sơ bệnh án được mã hóa và bảo mật 100%.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-user-md"></i></div>
                            <div className="feature-text">
                                <h4>Chuyên gia đầu ngành</h4>
                                <p>Đội ngũ Bác sĩ Tâm thần và Chuyên gia Tâm lý giàu kinh nghiệm.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-laptop-medical"></i></div>
                            <div className="feature-text">
                                <h4>Linh hoạt hình thức</h4>
                                <p>Lựa chọn khám tại phòng khám hoặc tư vấn từ xa qua Video Call.</p>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI 3: DANH SÁCH CHUYÊN GIA / GÓI KHÁM */}
                    <div className="mental-services-section">
                        <h3 className="section-title">Dịch vụ & Chuyên gia nổi bật</h3>
                        <div className="services-grid">
                            {listMentalServices && listMentalServices.length > 0 &&
                                listMentalServices.map((item, index) => {
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
                                                {/* Nhãn hình thức khám */}
                                                <div className="tag-type"><i className="fas fa-video"></i> {item.type}</div>
                                            </div>
                                            <div className="card-info">
                                                <h4 className="srv-name">{item.name}</h4>
                                                <div className="srv-expert">
                                                    <i className="fas fa-user-nurse"></i> {item.expert}
                                                </div>
                                                <div className="srv-bottom">
                                                    <div className="srv-price">{item.price}</div>
                                                    <button className="btn-book">Đặt lịch</button>
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
export default connect(mapStateToProps, mapDispatchToProps)(MentalHealth);