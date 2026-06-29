import React, { Component } from 'react';
import { connect } from "react-redux";
import { postVerifyBookAppointment } from '../../../services/userService';
import './VerifyEmail.scss';
import HomeHeader from '../../HomePage/HomeHeader';

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false, // Trạng thái đã gọi API xong chưa
            errCode: 0 // Kết quả trả về
        }
    }

    async componentDidMount() {
        // Lấy token và doctorId từ URL mà email trỏ tới
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');

            // Gọi API xuống Backend
            let res = await postVerifyBookAppointment({
                token: token,
                doctorId: doctorId
            })

            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
    }

    render() {
        let { statusVerify, errCode } = this.state;

        return (
            <>
                <HomeHeader isShowBanner={false} />

                <div className="verify-email-container">
                    {statusVerify === false ?
                        <div className="info-card loading-text">
                            <i className="fas fa-spinner fa-spin"></i> Đang xác nhận thông tin đặt lịch...
                        </div>
                        :
                        <div className="info-card result-text">
                            {errCode === 0 ?
                                <div className="infor-success">
                                    <i className="fas fa-check-circle"></i> Xác nhận lịch hẹn thành công! Cảm ơn bạn đã sử dụng BookingCare.
                                </div>
                                :
                                <div className="infor-failed">
                                    <i className="fas fa-times-circle"></i> Lịch hẹn không tồn tại hoặc đã được xác nhận trước đó!
                                </div>
                            }
                        </div>
                    }
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);