import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailService.scss';
import { getDetailPackageById } from '../../../services/userService';
import BookingPackageModal from './BookingPackageModal'; // Lát nữa tạo file này

class DetailService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceData: {},
            isOpenModalBooking: false
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailPackageById(id);
            if (res && res.errCode === 0) {
                this.setState({ serviceData: res.data });
            }
        }
    }

    handleOpenBookingModal = () => { this.setState({ isOpenModalBooking: true }); }
    handleCloseBookingModal = () => { this.setState({ isOpenModalBooking: false }); }

    render() {
        let { serviceData, isOpenModalBooking } = this.state;

        return (
            <div className="detail-service-container">
                <HomeHeader isShowBanner={false} />

                <div className="detail-service-body">
                    {/* CỘT TRÁI: BÀI VIẾT MÔ TẢ (Data thật từ DB) */}
                    <div className="content-left">
                        <div className="intro-section">
                            <h1>{serviceData.name}</h1>
                            <div className="clinic-info">
                                <p className="c-name"><i className="fas fa-hospital"></i> Cở sở y tế phụ trách (ID: {serviceData.clinicId})</p>
                            </div>
                        </div>

                        <div className="description-section">
                            <h3>Thông tin chi tiết</h3>
                            {/* 🛠️ Hàm này sẽ dịch mã HTML lưu trong DB thành Giao diện bài viết */}
                            <div className="mock-text" dangerouslySetInnerHTML={{ __html: serviceData.descriptionHTML }}>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: HỘP ĐẶT LỊCH */}
                    <div className="content-right">
                        <div className="booking-box">
                            <div className="box-header">ĐẶT LỊCH KHÁM</div>
                            <div className="box-body">
                                <div className="price-row">
                                    <span>Giá dịch vụ:</span>
                                    <span className="price-val">{serviceData.price}</span>
                                </div>
                                <div className="note-text mb-3">
                                    Vui lòng bấm nút bên dưới để điền thông tin cá nhân. Nhân viên y tế sẽ gọi lại xác nhận lịch!
                                </div>
                                <button className="btn btn-warning w-100 py-2 font-weight-bold" onClick={() => this.handleOpenBookingModal()}>
                                    ĐẶT LỊCH NGAY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🛠️ Gắn Component Modal Đặt Lịch vào đây */}
                <BookingPackageModal
                    isOpenModal={isOpenModalBooking}
                    closeBookingModal={this.handleCloseBookingModal}
                    packageData={serviceData}
                />
            </div>
        );
    }
}

const mapStateToProps = state => { return {}; };
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(DetailService);