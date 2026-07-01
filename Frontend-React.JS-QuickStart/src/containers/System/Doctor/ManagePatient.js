import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import * as actions from '../../../store/actions';
import moment from 'moment';
import { languages } from '../../../utils';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: []
        }
    }

    async componentDidMount() {
        this.getDataPatient();
    }

    getDataPatient = () => {
        let { user } = this.props;
        console.log(">>> Full keys của user:", Object.keys(user));
        let { currentDate } = this.state;

        // 🛠️ FIX CỨNG: Nếu chưa có user thì không gọi API, tránh lỗi 404/undefined
        if (user && user.id) {
            let formatedDate = new Date(currentDate).getTime();
            this.props.fetchAllPatientForDoctor({
                doctorId: user.id,
                date: formatedDate
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // 1. Khi dữ liệu bệnh nhân thay đổi từ Redux -> Cập nhật vào State
        if (this.props.dataPatient !== prevProps.dataPatient) {
            this.setState({
                dataPatient: this.props.dataPatient
            })
        }

        // 2. 🛠️ ĐỢI KHI CÓ USER RỒI MỚI GỌI API
        if (prevProps.user !== this.props.user && this.props.user && this.props.user.id) {
            this.getDataPatient();
        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, () => {
            this.getDataPatient();
        })
    }

    handleBtnConfirm = (item) => {
        console.log('btn confirm: ', item);
    }

    handleBtnRemedy = (item) => {
        console.log('btn remedy: ', item);
    }

    render() {
        console.log(">>> Kiểm tra props user:", this.props.user);
        let { dataPatient } = this.state;
        let { language } = this.props;

        return (
            <div className="manage-patient-container">
                <div className="m-p-title">
                    Quản lý bệnh nhân khám bệnh
                </div>
                <div className="manage-patient-body row">
                    <div className="col-4 form-group">
                        <label>Chọn ngày khám</label>
                        <DatePicker
                            onChange={this.handleOnChangeDatePicker}
                            className="form-control"
                            value={this.state.currentDate}
                        />
                    </div>
                    <div className="col-12 table-manage-patient">
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Thời gian</th>
                                    <th>Họ và tên</th>
                                    <th>Địa chỉ</th>
                                    <th>Giới tính</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataPatient && dataPatient.length > 0 ?
                                    dataPatient.map((item, index) => {
                                        let time = language === languages.VI ?
                                            item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn;
                                        let gender = language === languages.VI ?
                                            item.patientData.genderData.valueVi : item.patientData.genderData.valueEn;

                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{time}</td>
                                                <td>{item.patientData.firstName}</td>
                                                <td>{item.patientData.address}</td>
                                                <td>{gender}</td>
                                                <td>
                                                    <button className="mp-btn-confirm"
                                                        onClick={() => this.handleBtnConfirm(item)}>Xác nhận
                                                    </button>
                                                    <button className="mp-btn-remedy"
                                                        onClick={() => this.handleBtnRemedy(item)}>Gửi hóa đơn
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center" }}>Không có bệnh nhân đặt lịch</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log(">>> Check toàn bộ state Redux:", state);
    return {
        language: state.app.language,
        user: state.user.userInfo,
        dataPatient: state.admin.dataPatient
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllPatientForDoctor: (data) => dispatch(actions.fetchAllPatientForDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);