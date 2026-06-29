import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import { postPatientBookAppointment } from '../../../../services/userService';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions';
import { toast } from 'react-toastify';
import Select from 'react-select';
import _ from 'lodash';
import moment from 'moment';

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            genders: [], // Đã xóa doctorId và timeType ở đây vì nó thừa
        }
    }

    // Viết gọn lại bằng Computed Property Names của ES6
    handleOnChangeInput = (event, id) => {
        this.setState({
            [id]: event.target.value
        })
    }

    handleOnChangeDatePicker = (date) => {
        if (date && date.length > 0) {
            this.setState({
                birthday: date[0]
            })
        }
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption });
    }

    // Sửa lại chuẩn hàm map có return để không bị văng cảnh báo vàng
    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            result = data.map(item => {
                return {
                    label: language === 'vi' ? item.valueVi : item.valueEn,
                    value: item.keyMap
                }
            })
        }
        return result;
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === 'vi' ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            let date = language === 'vi' ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            return `${time} - ${date}`;
        }
        return '';
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === 'vi' ?
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                :
                `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
            return name;
        }
        return '';
    }

    handleConfirmBooking = async () => {
        let formattedBirthday = this.state.birthday ? new Date(this.state.birthday).getTime() : '';
        let { dataTime } = this.props;

        let doctorId = dataTime && dataTime.doctorId ? dataTime.doctorId : '';
        let timeType = dataTime && dataTime.timeType ? dataTime.timeType : '';
        let date = dataTime && dataTime.date ? dataTime.date : '';

        let timeString = this.buildTimeBooking(dataTime);
        let doctorName = this.buildDoctorName(dataTime);

        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: date,
            birthday: formattedBirthday,
            selectedGender: this.state.selectedGender ? this.state.selectedGender.value : '',
            doctorId: doctorId,
            timeType: timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        });

        if (res && res.errCode === 0) {
            toast.success('Lưu thông tin đặt lịch thành công!');
            this.props.closeBookingClose();
            this.setState({
                fullName: '',
                phoneNumber: '',
                email: '',
                address: '',
                reason: '',
                birthday: '',
                selectedGender: ''
            });
        } else {
            toast.error('Lỗi từ Server: ' + res.errMessage);
            console.log("Check dữ liệu bị lỗi:", res);
        }
    }

    componentDidMount() {
        this.props.getGenders();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            // 1. Dịch lại toàn bộ danh sách Options
            let translatedGenders = this.buildDataGender(this.props.genders);

            // 2. Dịch lại cái Option đang được hiển thị ở ô chọn (nếu có)
            let updatedSelectedGender = this.state.selectedGender;

            // Nếu người dùng đã chọn một giá trị trước đó (ví dụ đang chọn "Nữ")
            if (updatedSelectedGender) {
                // Ta tìm trong mảng tiếng Anh mới vừa dịch xem thằng nào có cùng "value"
                // thì ta lấy lại object mới của nó (chứa label tiếng Anh) để ghi đè vào state
                updatedSelectedGender = translatedGenders.find(
                    item => item.value === updatedSelectedGender.value
                );
            }

            // 3. Cập nhật lại State cho cả 2 thằng
            this.setState({
                genders: translatedGenders,
                selectedGender: updatedSelectedGender // Đã được dịch sang ngôn ngữ mới
            })
        }

        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }

        // Đã cắt bỏ hoàn toàn đoạn code cập nhật doctorId và timeType rườm rà ở đây
    }

    render() {
        let { isOpenModal, closeBookingClose, dataTime, language } = this.props;

        return (
            <Modal
                isOpen={isOpenModal}
                className={'booking-modal-container'}
                size="lg"
                centered
            >
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <span className="left">
                            <FormattedMessage id="patient.booking-modal.title" />
                        </span>
                        <span
                            className="right"
                            onClick={closeBookingClose}
                        ><i className="fas fa-times"></i></span>
                    </div>
                    <div className="booking-modal-body">
                        <div className="doctor-infor">
                            <ProfileDoctor
                                doctorId={dataTime && dataTime.doctorId ? dataTime.doctorId : ''}
                                isShowDescriptionDoctor={false}
                                dataTime={dataTime}
                            />
                        </div>

                        <div className="row">
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.fullName" /></label>
                                <input className="form-control"
                                    value={this.state.fullName}
                                    onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.phoneNumber" /></label>
                                <input className="form-control"
                                    value={this.state.phoneNumber}
                                    onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.email" /></label>
                                <input className="form-control"
                                    value={this.state.email}
                                    onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.address" /></label>
                                <input className="form-control"
                                    value={this.state.address}
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                />
                            </div>
                            <div className="col-12 form-group">
                                <label><FormattedMessage id="patient.booking-modal.reason" /></label>
                                <input className="form-control"
                                    value={this.state.reason}
                                    onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.birthday" /></label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={this.state.birthday}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                                <Select
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genders}
                                    placeholder={language === 'vi' ? 'Vui lòng chọn giới tính' : 'Please choose gender'}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="booking-modal-footer">
                        <button className="btn-booking-confirm" onClick={() => this.handleConfirmBooking()}>
                            <FormattedMessage id="patient.booking-modal.btnConfirm" />
                        </button>
                        <button className="btn-booking-cancel" onClick={closeBookingClose}>
                            <FormattedMessage id="patient.booking-modal.btnCancel" />
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);