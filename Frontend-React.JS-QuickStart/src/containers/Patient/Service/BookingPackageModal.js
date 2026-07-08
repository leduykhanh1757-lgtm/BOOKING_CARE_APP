import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import './BookingPackageModal.scss';
import { postBookPackage } from '../../../services/userService';
import { toast } from 'react-toastify';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';

class BookingPackageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '', phoneNumber: '', email: '',
            address: '', reason: '', birthday: '', gender: 'M',
            isShowLoading: false
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    }

    handleOnChangeDatePicker = (date) => {
        if (date && date.length > 0) {
            this.setState({ bookingDate: date[0] })
        }
    }

    handleConfirmBooking = async () => {
        let { packageData, language } = this.props;

        this.setState({ isShowLoading: true });

        // Format ngày tháng đẹp đẽ trước khi gửi vào Email
        let formattedDate = this.state.bookingDate
            ? moment(this.state.bookingDate).format('DD/MM/YYYY')
            : 'Chưa chọn ngày';

        let res = await postBookPackage({
            ...this.state,
            packageId: packageData.id,
            packageName: packageData.name,
            serviceType: packageData.serviceType,
            bookingDate: formattedDate, // Gửi ngày đã format
            language: language // TRUYỀN NGÔN NGỮ TỪ REDUX XUỐNG API
        });

        if (res && res.errCode === 0) {
            this.setState({ isShowLoading: false }); // Tắt loading
            toast.success("Đặt lịch Gói Khám thành công!");
            this.props.closeBookingModal();
            this.setState({ fullName: '', phoneNumber: '', email: '', address: '', reason: '', bookingDate: '' });
        } else {
            this.setState({ isShowLoading: false }); // Tắt loading
            toast.error("Lỗi đặt lịch: " + res.errMessage);
        }
    }

    render() {
        let { isOpenModal, closeBookingModal, packageData } = this.props;
        let type = packageData && packageData.serviceType ? packageData.serviceType : 'general';

        return (
            <Modal isOpen={isOpenModal} className={'booking-modal-container'} size="lg" centered>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Đang xử lý gửi Email...'
                >
                    <div className="booking-modal-content">
                        <div className="booking-modal-header text-white" style={{ backgroundColor: '#45c3d2', padding: '15px' }}>
                            <h5 className="modal-title m-0"><i className="fas fa-calendar-check"></i> ĐẶT LỊCH GÓI KHÁM</h5>
                            <span className="right" onClick={closeBookingModal} style={{ cursor: 'pointer', fontSize: '20px' }}>
                                <i className="fas fa-times"></i>
                            </span>
                        </div>

                        <div className="booking-modal-body p-4">
                            {/* THÔNG TIN GÓI KHÁM ĐƯỢC LÀM NỔI BẬT */}
                            <div className="package-info-card p-3 mb-4" style={{ backgroundColor: '#f8f9fa', borderLeft: '4px solid #f0ad4e', borderRadius: '5px' }}>
                                <h5 style={{ color: '#333', fontWeight: 'bold' }}>{packageData.name}</h5>
                                <div className="text-danger font-weight-bold" style={{ fontSize: '18px' }}>
                                    Giá: {packageData.price}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-6 form-group">
                                    <label>Họ tên người khám (*)</label>
                                    <input className="form-control" value={this.state.fullName} onChange={(e) => this.handleOnChangeInput(e, 'fullName')} placeholder="Nhập họ và tên..." />
                                </div>
                                <div className="col-6 form-group">
                                    <label>Số điện thoại (*)</label>
                                    <input className="form-control" value={this.state.phoneNumber} onChange={(e) => this.handleOnChangeInput(e, 'phoneNumber')} placeholder="Số điện thoại liên hệ..." />
                                </div>
                                <div className="col-6 form-group mt-3">
                                    <label>Địa chỉ Email (*)</label>
                                    <input className="form-control" value={this.state.email} onChange={(e) => this.handleOnChangeInput(e, 'email')} placeholder="Để nhận thông báo/link khám..." />
                                </div>

                                {/* BỔ SUNG Ô CHỌN NGÀY KHÁM */}
                                <div className="col-6 form-group mt-3">
                                    <label>Ngày muốn khám (*)</label>
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className="form-control"
                                        value={this.state.bookingDate}
                                        placeholder="Chọn ngày khám..."
                                    />
                                </div>

                                {/* ẨN/HIỆN ĐỊA CHỈ TÙY LOẠI HÌNH */}
                                {type !== 'remote-examination' && type !== 'mental-health' &&
                                    <div className="col-12 form-group mt-3">
                                        <label>Địa chỉ liên hệ</label>
                                        <input className="form-control" value={this.state.address} onChange={(e) => this.handleOnChangeInput(e, 'address')} placeholder="Nhập địa chỉ của bạn..." />
                                    </div>
                                }

                                <div className="col-12 form-group mt-3">
                                    <label>Triệu chứng / Ghi chú cho bác sĩ</label>
                                    <textarea className="form-control" rows="3" value={this.state.reason} onChange={(e) => this.handleOnChangeInput(e, 'reason')} placeholder="Mô tả triệu chứng hoặc yêu cầu đặc biệt..."></textarea>
                                </div>
                            </div>

                            {/* GHI CHÚ ĐẶC BIỆT */}
                            <div className="booking-note mt-4 p-3" style={{ backgroundColor: '#fff8e1', borderRadius: '5px', fontSize: '14px', color: '#666' }}>
                                {type === 'remote-examination' || type === 'mental-health'
                                    ? <span><i className="fas fa-video text-danger"></i> <b>Khám Trực Tuyến:</b> Thông tin thanh toán và Link phòng khám (Zoom/Meet) sẽ được gửi vào Email của bạn ngay sau khi xác nhận.</span>
                                    : (type === 'medical-test'
                                        ? <span><i className="fas fa-flask text-danger"></i> <b>Lưu ý Xét nghiệm:</b> Vui lòng nhịn ăn sáng (chỉ uống nước lọc) để kết quả xét nghiệm máu/nước tiểu được chính xác nhất.</span>
                                        : <span><i className="fas fa-map-marker-alt text-danger"></i> <b>Lưu ý:</b> Vui lòng đến đúng giờ tại cơ sở y tế. Email xác nhận đã được gửi cho bạn!</span>)
                                }
                            </div>
                        </div>

                        <div className="booking-modal-footer p-3 border-top text-right">
                            <button className="btn btn-secondary mr-2" onClick={closeBookingModal}>Hủy bỏ</button>
                            <button className="btn btn-primary font-weight-bold" onClick={() => this.handleConfirmBooking()}>Xác nhận đặt lịch</button>
                        </div>
                    </div>
                </LoadingOverlay>

            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(BookingPackageModal);