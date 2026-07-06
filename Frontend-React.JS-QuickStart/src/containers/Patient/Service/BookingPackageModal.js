import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import './BookingPackageModal.scss';
import { postBookPackage } from '../../../services/userService';
import { toast } from 'react-toastify';

class BookingPackageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '', phoneNumber: '', email: '',
            address: '', reason: '', birthday: '', gender: 'M'
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    }

    handleConfirmBooking = async () => {
        let { packageData } = this.props;
        let res = await postBookPackage({
            ...this.state,
            packageId: packageData.id,
            packageName: packageData.name
        });

        if (res && res.errCode === 0) {
            toast.success("Đặt lịch Gói Khám thành công! Vui lòng chú ý điện thoại.");
            this.props.closeBookingModal(); // Đóng form
            // Reset form
            this.setState({ fullName: '', phoneNumber: '', email: '', address: '', reason: '', birthday: '' });
        } else {
            toast.error("Lỗi đặt lịch: " + res.errMessage);
        }
    }

    render() {
        let { isOpenModal, closeBookingModal, packageData } = this.props;

        return (
            <Modal isOpen={isOpenModal} className={'booking-modal-container'} size="lg" centered>
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <span className="left">Thông tin đặt lịch khám</span>
                        <span className="right" onClick={closeBookingModal}><i className="fas fa-times"></i></span>
                    </div>

                    <div className="booking-modal-body">
                        <div className="doctor-infor mb-4" style={{ color: '#45c3d2', fontWeight: 'bold' }}>
                            <i className="fas fa-notes-medical"></i> Đang đặt lịch: {packageData.name} ({packageData.price})
                        </div>

                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Họ tên</label>
                                <input className="form-control" value={this.state.fullName} onChange={(e) => this.handleOnChangeInput(e, 'fullName')} />
                            </div>
                            <div className="col-6 form-group">
                                <label>Số điện thoại</label>
                                <input className="form-control" value={this.state.phoneNumber} onChange={(e) => this.handleOnChangeInput(e, 'phoneNumber')} />
                            </div>
                            <div className="col-6 form-group mt-3">
                                <label>Địa chỉ Email</label>
                                <input className="form-control" value={this.state.email} onChange={(e) => this.handleOnChangeInput(e, 'email')} />
                            </div>
                            <div className="col-6 form-group mt-3">
                                <label>Địa chỉ liên hệ</label>
                                <input className="form-control" value={this.state.address} onChange={(e) => this.handleOnChangeInput(e, 'address')} />
                            </div>
                            <div className="col-12 form-group mt-3">
                                <label>Lý do khám / Ghi chú</label>
                                <input className="form-control" value={this.state.reason} onChange={(e) => this.handleOnChangeInput(e, 'reason')} />
                            </div>
                        </div>
                    </div>

                    <div className="booking-modal-footer">
                        <button className="btn-booking-confirm" onClick={() => this.handleConfirmBooking()}>Xác nhận đặt lịch</button>
                        <button className="btn-booking-cancel" onClick={closeBookingModal}>Hủy bỏ</button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => { return {}; };
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(BookingPackageModal);