import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfor.scss';
import { getExtraInforDoctorById } from '../../../services/userService'; // IMPORT API
import { NumericFormat as NumberFormat } from 'react-number-format';
import { FormattedMessage } from 'react-intl';

class DoctorExtraInfor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {} // 🛠️ TẠO RỔ HỨNG DATA TỪ API
        }
    }

    async componentDidMount() {
        // Gọi API lần đầu tiên khi component vừa render xong
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        // Gọi lại API mỗi khi chọn sang một ông bác sĩ khác (ID thay đổi)
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }

    showHideDetailInfor = (status) => {
        this.setState({
            isShowDetailInfor: status
        })
    }

    render() {
        let { isShowDetailInfor, extraInfor } = this.state;
        let { language } = this.props;

        return (
            <div className="doctor-extra-infor-container">
                {/* Phần trên: Địa chỉ khám */}
                <div className="content-up">
                    <div className="title-address">
                        <FormattedMessage id="patient.extra-infor-doctor.text-address" />
                    </div>
                    <div className="name-clinic">{extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}</div>
                    <div className="detail-address">{extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}</div>
                </div>

                {/* Phần dưới: Giá khám & Phương thức thanh toán */}
                <div className="content-down">
                    {isShowDetailInfor === false ?
                        <div className="short-infor">
                            <FormattedMessage id="patient.extra-infor-doctor.price" />:
                            {extraInfor && extraInfor.priceTypeData && language === 'vi' &&
                                <NumberFormat
                                    className="currency"
                                    value={extraInfor.priceTypeData.valueVi}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={' VNĐ'}
                                />
                            }
                            {extraInfor && extraInfor.priceTypeData && language === 'en' &&
                                <NumberFormat
                                    className="currency"
                                    value={extraInfor.priceTypeData.valueEn}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={' $'}
                                />
                            }
                            <span className="detail" onClick={() => this.showHideDetailInfor(true)}>
                                <FormattedMessage id="patient.extra-infor-doctor.detail" />
                            </span>
                        </div>
                        :
                        <div className="detail-infor">
                            <div className="price-info">
                                <div className="left">
                                    <span className="title">
                                        <FormattedMessage id="patient.extra-infor-doctor.price" />
                                    </span>
                                    <span className="note">{extraInfor && extraInfor.note ? extraInfor.note : ''}</span>
                                </div>
                                <div className="right">
                                    {extraInfor && extraInfor.priceTypeData && language === 'vi' &&
                                        <NumberFormat
                                            className="currency"
                                            value={extraInfor.priceTypeData.valueVi}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={' VNĐ'}
                                        />
                                    }
                                    {extraInfor && extraInfor.priceTypeData && language === 'en' &&
                                        <NumberFormat
                                            className="currency"
                                            value={extraInfor.priceTypeData.valueEn}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={' $'}
                                        />
                                    }
                                </div>
                            </div>
                            <div className="payment-info">
                                <FormattedMessage id="patient.extra-infor-doctor.payment" />
                                &nbsp;
                                {extraInfor && extraInfor.paymentTypeData && language === 'vi' ? extraInfor.paymentTypeData.valueVi : ''}
                                {extraInfor && extraInfor.paymentTypeData && language === 'en' ? extraInfor.paymentTypeData.valueEn : ''}
                            </div>
                            <div className="hide-price">
                                <span onClick={() => this.showHideDetailInfor(false)}>
                                    <FormattedMessage id="patient.extra-infor-doctor.hide-price" />
                                </span>
                            </div>
                        </div>
                    }
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);