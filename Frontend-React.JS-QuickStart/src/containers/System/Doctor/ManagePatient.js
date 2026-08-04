import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import * as actions from '../../../store/actions';
import moment from 'moment';
import { languages } from '../../../utils';
import RemedyModal from './RemedyModal';
import DoctorChatModal from './Modal/DoctorChatModal';
import { postSendRemedy } from '../../../services/userService';
import { toast } from 'react-toastify';

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isOpenChatModal: false,
            dataChatModal: {},
            isShowLoading: false,
            statusTab: 'S2' // 'S2': Chờ khám, 'S3': Lịch sử đã khám
        }
    }

    async componentDidMount() {
        this.getDataPatient();
    }

    getDataPatient = () => {
        let { user } = this.props;
        let { currentDate, statusTab } = this.state;

        if (user && user.id) {
            let formatedDate = new Date(currentDate).getTime();
            this.props.fetchAllPatientForDoctor({
                doctorId: user.id,
                date: formatedDate,
                statusId: statusTab
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.dataPatient !== prevProps.dataPatient) {
            this.setState({
                dataPatient: this.props.dataPatient
            })
        }

        if (prevProps.user !== this.props.user && this.props.user && this.props.user.id) {
            this.getDataPatient();
        }
    }

    handleChangeTab = (status) => {
        this.setState({
            statusTab: status
        }, () => {
            this.getDataPatient();
        });
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
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    handleOpenChatModal = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            patientName: item.patientData.firstName
        }

        this.setState({
            isOpenChatModal: true,
            dataChatModal: data
        });
    }

    closeChatModal = () => {
        this.setState({
            isOpenChatModal: false,
            dataChatModal: {}
        });
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        let { language } = this.props;

        this.setState({ isShowLoading: true });

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
            this.setState({ isShowLoading: false });
            toast.success('Gửi hóa đơn khám bệnh thành công!');
            this.closeRemedyModal();
            this.getDataPatient();
        } else {
            this.setState({ isShowLoading: false });
            toast.error('Gửi hóa đơn thất bại, vui lòng thử lại!');
            console.log('error send remedy: ', res);
        }
    }

    render() {
        let { dataPatient, isOpenRemedyModal, dataModal, isOpenChatModal, dataChatModal, isShowLoading, statusTab } = this.state;
        let { language } = this.props;

        let totalCount = dataPatient ? dataPatient.length : 0;
        let pricePerPatient = 250000;
        let estimatedRevenue = statusTab === 'S3' ? totalCount * pricePerPatient : 0;

        return (
            <>
                <div className="manage-patient-container">
                    <div className="m-p-title">
                        BÁO CÁO THỐNG KÊ & QUẢN LÝ BỆNH NHÂN
                    </div>

                    {/* 📊 DOCTOR DASHBOARD ANALYTICS STAT CARDS */}
                    <div className="container-fluid my-3">
                        <div className="row">
                            <div className="col-md-3 col-sm-6 mb-3">
                                <div className="card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2248bd 100%)', color: '#fff', borderRadius: '12px', padding: '16px' }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.9, fontWeight: '700' }}>TỔNG BỆNH NHÂN DÂN DANH SÁCH</div>
                                            <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>{totalCount}</div>
                                        </div>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                            <i className="fas fa-users"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 col-sm-6 mb-3">
                                <div className="card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#fff', borderRadius: '12px', padding: '16px' }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.9, fontWeight: '700' }}>CHỜ KHÁM (CHƯA GỬI ĐƠN)</div>
                                            <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>{statusTab === 'S2' ? totalCount : 0}</div>
                                        </div>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                            <i className="fas fa-user-clock"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 col-sm-6 mb-3">
                                <div className="card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)', color: '#fff', borderRadius: '12px', padding: '16px' }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.9, fontWeight: '700' }}>ĐÃ KHÁM XONG (S3)</div>
                                            <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>{statusTab === 'S3' ? totalCount : 0}</div>
                                        </div>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                            <i className="fas fa-check-circle"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-3 col-sm-6 mb-3">
                                <div className="card shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)', color: '#fff', borderRadius: '12px', padding: '16px' }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.9, fontWeight: '700' }}>DOANH THU ƯỚC TÍNH</div>
                                            <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '6px' }}>{estimatedRevenue > 0 ? estimatedRevenue.toLocaleString('vi-VN') + ' VNĐ' : 'Chưa cập nhật'}</div>
                                        </div>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                            <i className="fas fa-coins"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="manage-patient-body row">
                        <div className="col-4 form-group mb-3">
                            <label style={{ fontWeight: 'bold' }}>Chọn ngày khám</label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}
                            />
                        </div>

                        {/* TAB CHUYỂN ĐỔI CHỜ KHÁM / LỊCH SỬ ĐÃ KHÁM */}
                        <div className="col-12 my-2" style={{ display: 'flex', gap: '12px' }}>
                            <button
                                className="btn"
                                style={{
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    backgroundColor: statusTab === 'S2' ? '#2248bd' : '#f8fafc',
                                    color: statusTab === 'S2' ? '#ffffff' : '#475569',
                                    border: statusTab === 'S2' ? 'none' : '1px solid #cbd5e1',
                                    padding: '8px 18px'
                                }}
                                onClick={() => this.handleChangeTab('S2')}
                            >
                                <i className="fas fa-user-clock mr-2"></i> Bệnh nhân chờ khám (Xác nhận)
                            </button>
                            <button
                                className="btn"
                                style={{
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    backgroundColor: statusTab === 'S3' ? '#2248bd' : '#f8fafc',
                                    color: statusTab === 'S3' ? '#ffffff' : '#475569',
                                    border: statusTab === 'S3' ? 'none' : '1px solid #cbd5e1',
                                    padding: '8px 18px'
                                }}
                                onClick={() => this.handleChangeTab('S3')}
                            >
                                <i className="fas fa-history mr-2"></i> Lịch sử bệnh nhân đã khám xong
                            </button>
                        </div>

                        <div className="col-12 table-manage-patient mt-3">
                            <table style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Thời gian</th>
                                        <th>Họ và tên</th>
                                        <th>Địa chỉ</th>
                                        <th>Giới tính</th>
                                        <th>Trạng thái & Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataPatient && dataPatient.length > 0 ?
                                        dataPatient.map((item, index) => {
                                            let time = (item && item.timeTypeDataPatient)
                                                ? (language === languages.VI ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn)
                                                : '';

                                            let gender = (item && item.patientData && item.patientData.genderData)
                                                ? (language === languages.VI ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn)
                                                : '';

                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{time}</td>
                                                    <td>{item.patientData ? item.patientData.firstName : ''}</td>
                                                    <td>{item.patientData ? item.patientData.address : ''}</td>
                                                    <td>{gender}</td>
                                                    <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        {statusTab === 'S2' ? (
                                                            <button className="btn btn-sm text-white"
                                                                style={{ borderRadius: '6px', fontWeight: 'bold', backgroundColor: '#2248bd', borderColor: '#2248bd' }}
                                                                onClick={() => this.handleBtnConfirm(item)}>
                                                                <i className="fas fa-file-medical mr-1"></i> Gửi hóa đơn & Đơn thuốc
                                                            </button>
                                                        ) : (
                                                            <span className="badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>
                                                                <i className="fas fa-check-circle mr-1"></i> Đã hoàn thành khám
                                                            </span>
                                                        )}

                                                        <button className="btn btn-sm text-white"
                                                            style={{ borderRadius: '6px', fontWeight: 'bold', backgroundColor: '#45c3d2', borderColor: '#45c3d2' }}
                                                            onClick={() => this.handleOpenChatModal(item)}>
                                                            <i className="fas fa-comments mr-1"></i> Nhắn tin
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                                {statusTab === 'S2' ? 'Không có bệnh nhân chờ khám trong ngày này' : 'Chưa có lịch sử bệnh nhân nào đã hoàn thành khám trong ngày này'}
                                            </td>
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

                <DoctorChatModal
                    isOpenModal={isOpenChatModal}
                    dataModal={dataChatModal}
                    closeChatModal={this.closeChatModal}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
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