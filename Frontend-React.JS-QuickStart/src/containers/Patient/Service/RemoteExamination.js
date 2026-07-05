import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './RemoteExamination.scss';

class RemoteExamination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Mock data các chuyên khoa khám từ xa (sau này bác thay bằng API là xong)
            listRemoteSpecialties: [
                { id: 1, name: "Tư vấn Tâm lý từ xa", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 2, name: "Khám Da liễu qua Video", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 3, name: "Khám Nhi khoa từ xa", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 4, name: "Bác sĩ Nội tiết - Tiểu đường", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 5, name: "Khám Tiêu hóa từ xa", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
                { id: 6, name: "Tư vấn Thần kinh - Cột sống", image: "https://bookingcare.vn/wp-content/uploads/2020/06/102602-goi-kham-tong-quat.jpg" },
            ]
        }
    }

    handleViewDetail = (item) => {
        // Tạm thời alert, sau này nối API thì dùng history.push chuyển trang
        alert(`Bác đang chọn khám từ xa khoa: ${item.name}`);
    }

    render() {
        let { listRemoteSpecialties } = this.state;

        return (
            <div className="remote-exam-container">
                <HomeHeader isShowBanner={false} />

                {/* KHỐI 1: BANNER CHUYÊN ĐỀ */}
                <div className="remote-banner">
                    <div className="banner-overlay">
                        <div className="banner-content">
                            <h2>Bác sĩ chuyên khoa từ xa</h2>
                            <p>Kết nối Video Call với bác sĩ giỏi mọi lúc, mọi nơi. An toàn - Bảo mật - Tiết kiệm thời gian.</p>
                        </div>
                    </div>
                </div>

                <div className="remote-body">
                    {/* KHỐI 2: HƯỚNG DẪN QUY TRÌNH (HOW IT WORKS) */}
                    <div className="how-it-works-section">
                        <h3 className="section-title">Quy trình khám bệnh qua Video</h3>
                        <div className="steps-container">
                            <div className="step-item">
                                <div className="step-icon"><i className="far fa-calendar-check"></i></div>
                                <h4>1. Đặt lịch</h4>
                                <p>Chọn bác sĩ và thời gian phù hợp trên hệ thống.</p>
                            </div>
                            <div className="step-item">
                                <div className="step-icon"><i className="far fa-credit-card"></i></div>
                                <h4>2. Thanh toán</h4>
                                <p>Thanh toán phí khám trực tuyến an toàn.</p>
                            </div>
                            <div className="step-item">
                                <div className="step-icon"><i className="fas fa-link"></i></div>
                                <h4>3. Nhận liên kết</h4>
                                <p>Nhận link phòng khám Video qua Email/Zalo.</p>
                            </div>
                            <div className="step-item">
                                <div className="step-icon"><i className="fas fa-user-md"></i></div>
                                <h4>4. Gặp bác sĩ</h4>
                                <p>Bấm vào link để bắt đầu trò chuyện với bác sĩ.</p>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI 3: DANH SÁCH CHUYÊN KHOA TỪ XA */}
                    <div className="specialty-section">
                        <h3 className="section-title">Các chuyên khoa phổ biến</h3>
                        <div className="specialty-grid">
                            {listRemoteSpecialties && listRemoteSpecialties.length > 0 &&
                                listRemoteSpecialties.map((item, index) => {
                                    return (
                                        <div
                                            className="specialty-card"
                                            key={index}
                                            onClick={() => this.handleViewDetail(item)}
                                        >
                                            <div
                                                className="card-image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
                                            <div className="card-name">
                                                <span>{item.name}</span>
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
export default connect(mapStateToProps, mapDispatchToProps)(RemoteExamination);