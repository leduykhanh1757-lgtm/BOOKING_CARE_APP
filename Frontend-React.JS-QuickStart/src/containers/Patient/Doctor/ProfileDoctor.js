import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ProfileDoctor.scss';
import { getProfileDoctorById } from '../../../services/userService';
import { NumericFormat as NumberFormat } from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';

class ProfileDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId);
        this.setState({
            dataProfile: data
        });
    }

    getInforDoctor = async (id) => {
        let result = {};
        if (id) {
            let res = await getProfileDoctorById(id);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }
        // Gọi lại API nếu ID bác sĩ bị thay đổi
        if (this.props.doctorId !== prevProps.doctorId) {
            let data = await this.getInforDoctor(this.props.doctorId);
            this.setState({
                dataProfile: data
            });
        }
    }

    renderTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            // Lấy ra chuỗi giờ (VD: 8:00 - 9:00)
            let time = language === 'vi' ?
                dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            // Lấy ra chuỗi ngày và format lại bằng moment
            let date = language === 'vi' ?
                _.capitalize(moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')) :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');

            return (
                <>
                    <div>{time} - {date}</div>
                    <div><FormattedMessage id="patient.booking-modal.priceBooking" /></div>
                </>
            )
        }
        return <></>
    }
    render() {
        let { dataProfile } = this.state;
        let { language, isShowDescriptionDoctor, dataTime } = this.props;

        let nameVi = '', nameEn = '';
        if (dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }

        return (
            <div className="profile-doctor-container">
                <div className="intro-doctor">
                    {/* Hiển thị Ảnh đại diện */}
                    <div className='content-left'>
                        <div className="doctor-image"
                            style={{ backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})` }}
                        ></div>
                    </div>

                    {/* Hiển thị Tên bác sĩ và Ghi chú */}
                    <div className='content-right'>
                        <div className='up'>
                            {language === 'vi' ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {isShowDescriptionDoctor === true ?
                                // NẾU TRUE: Hiện mô tả dài (dùng cho trang Chi tiết bác sĩ)
                                <>
                                    {dataProfile && dataProfile.markdownData && dataProfile.markdownData.description
                                        && <span>{dataProfile.markdownData.description}</span>
                                    }
                                </>
                                :
                                // NẾU FALSE: Hiện thời gian khám (dùng cho Modal đặt lịch)
                                <>
                                    {this.renderTimeBooking(dataTime)}
                                </>
                            }
                        </div>
                        <div className="price">
                            <FormattedMessage id="patient.extra-infor-doctor.price" />:
                            {dataProfile && dataProfile.Doctor_Infor && language === 'vi' &&
                                <NumberFormat
                                    className="currency"
                                    value={dataProfile.Doctor_Infor.priceTypeData.valueVi}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={' VNĐ'}
                                />
                            }
                            {dataProfile && dataProfile.Doctor_Infor && language === 'en' &&
                                <NumberFormat
                                    className="currency"
                                    value={dataProfile.Doctor_Infor.priceTypeData.valueEn}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={' $'}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);