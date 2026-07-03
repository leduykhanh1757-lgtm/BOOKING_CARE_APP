import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import * as actions from '../../../store/actions';
import moment from 'moment';
import { languages } from '../../../utils';
import RemedyModal from './RemedyModal';
import { postSendRemedy } from '../../../services/userService'; // Import API vừa viết
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false
        }
    }

    async componentDidMount() {
        this.getDataPatient();
    }

    getDataPatient = () => {
        let { user } = this.props;
        console.log(">>> Full keys của user:", Object.keys(user));
        let { currentDate } = this.state;

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
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName
        }

        this.setState({
            isOpenRemedyModal: true, // Bật modal lên
            dataModal: data // Ném cục data vào state để lát truyền sang Modal
        })
    }

    // 🛠️ Thêm luôn hàm này để lát bấm nút "Hủy" thì Modal đóng lại
    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }
    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        let { language } = this.props;

        this.setState({ isShowLoading: true }); // Bật loading lên

        // Gọi API gửi xuống Backend
        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            patientName: dataModal.patientName,
            language: language
        });

        if (res && res.errCode === 0) {
            this.setState({ isShowLoading: false }); // Tắt loading
            toast.success('Gửi hóa đơn khám bệnh thành công!');
            this.closeRemedyModal();
            this.getDataPatient(); // 🛠️ Load lại danh sách bệnh nhân để cái lịch vừa xong biến mất
        } else {
            this.setState({ isShowLoading: false }); // Tắt loading
            toast.error('Gửi hóa đơn thất bại, vui lòng thử lại!');
            console.log('error send remedy: ', res);
        }
    }

    handleBtnRemedy = (item) => {
        console.log('btn remedy: ', item);
    }

    render() {
        let { dataPatient, isOpenRemedyModal, dataModal, isShowLoading } = this.state;
        let { language } = this.props;

        return (
            <>
                <div className="manage-patient-container">
                    <div className="m-p-title">
                        Quản lý bệnh nhân
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
                <RemedyModal
                    isOpenModal={isOpenRemedyModal}
                    dataModal={dataModal}
                    closeRemedyModal={this.closeRemedyModal}
                    sendRemedy={this.sendRemedy}
                    isShowLoading={isShowLoading}
                />
            </>

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