import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './DentalExamination.scss';

class DentalExamination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Mock data các dịch vụ Nha khoa hot
            listDentalServices: [
                { id: 1, name: "Niềng răng - Chỉnh nha Mắc cài/Trong suốt", clinic: "Hệ thống Nha khoa Kim", price: "Từ 15.000.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg", rating: "4.9" },
                { id: 2, name: "Trồng răng Implant kỹ thuật cao", clinic: "Nha khoa Lạc Việt Intech", price: "Từ 10.500.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg", rating: "4.8" },
                { id: 3, name: "Bọc răng sứ thẩm mỹ tự nhiên", clinic: "Nha khoa Quốc tế Paris", price: "Từ 2.000.000đ/răng", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg", rating: "5.0" },
                { id: 4, name: "Nhổ răng khôn (số 8) không đau", clinic: "Bệnh viện Răng Hàm Mặt", price: "Từ 1.000.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg", rating: "4.7" },
                { id: 5, name: "Tẩy trắng răng Laser White", clinic: "Nha khoa Parkway", price: "Từ 1.500.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg", rating: "4.9" },
                { id: 6, name: "Khám & Điều trị sâu răng trẻ em", clinic: "Phòng khám Nha khoa Nhi đồng", price: "Từ 200.000đ", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg", rating: "4.8" },
            ]
        }
    }

    handleViewDetail = (item) => {
        alert(`Bác đang xem chi tiết dịch vụ: ${item.name} tại ${item.clinic}`);
    }

    render() {
        let { listDentalServices } = this.state;

        return (
            <div className="dental-exam-container">
                <HomeHeader isShowBanner={false} />

                {/* KHỐI 1: BANNER NHA KHOA */}
                <div className="dental-banner">
                    <div className="banner-overlay">
                        <div className="banner-content">
                            <h2>Khám & Điều trị Nha khoa</h2>
                            <p>Quy tụ các phòng khám nha khoa uy tín, trang thiết bị hiện đại. Trả lại nụ cười tự tin cho bạn.</p>
                        </div>
                    </div>
                </div>

                <div className="dental-body">
                    {/* KHỐI 2: LÝ DO CHỌN BOOKINGCARE */}
                    <div className="features-section">
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-tooth"></i></div>
                            <div className="feature-text">
                                <h4>Phòng khám chuẩn Quốc tế</h4>
                                <p>100% đối tác sở hữu trang thiết bị nha khoa vô trùng, hiện đại.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-user-md"></i></div>
                            <div className="feature-text">
                                <h4>Nha sĩ chuyên khoa</h4>
                                <p>Đội ngũ bác sĩ Răng Hàm Mặt tay nghề cao, tu nghiệp nước ngoài.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-tags"></i></div>
                            <div className="feature-text">
                                <h4>Minh bạch chi phí</h4>
                                <p>Bảng giá dịch vụ rõ ràng, không phát sinh chi phí phụ.</p>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI 3: DANH SÁCH DỊCH VỤ NHA KHOA */}
                    <div className="dental-services-section">
                        <h3 className="section-title">Dịch vụ Nha khoa nổi bật</h3>
                        <div className="services-grid">
                            {listDentalServices && listDentalServices.length > 0 &&
                                listDentalServices.map((item, index) => {
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
                                                <div className="tag-rating"><i className="fas fa-star"></i> {item.rating}</div>
                                            </div>
                                            <div className="card-info">
                                                <h4 className="srv-name">{item.name}</h4>
                                                <div className="srv-clinic">
                                                    <i className="far fa-hospital"></i> {item.clinic}
                                                </div>
                                                <div className="srv-bottom">
                                                    <div className="srv-price">{item.price}</div>
                                                    <button className="btn-book">Tư vấn ngay</button>
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
export default connect(mapStateToProps, mapDispatchToProps)(DentalExamination);