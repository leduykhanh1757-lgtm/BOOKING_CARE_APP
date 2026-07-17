import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import './ForgotPassword.scss';
import { forgotPasswordService, verifyForgotPasswordService } from '../../services/userService';
import { toast } from 'react-toastify';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1, // 1: enter email, 2: enter otp & new password
            email: '',
            otp: '',
            newPassword: '',
            confirmPassword: '',
            isShowPassword: false,
            errMessage: '',
            isLoading: false
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handleSendCode = async () => {
        this.setState({ errMessage: '' });
        let { email } = this.state;
        let language = this.props.language;
        
        if (!email) {
            this.setState({ errMessage: language === 'vi' ? "Vui lòng nhập email!" : "Please enter your email!" });
            return;
        }

        this.setState({ isLoading: true });
        try {
            let res = await forgotPasswordService(email, language);
            this.setState({ isLoading: false });
            
            if (res && res.errCode === 0) {
                toast.success(language === 'vi' ? "Mã xác nhận đã được gửi đến email của bạn!" : "Verification code has been sent to your email!");
                this.setState({ step: 2 });
            } else {
                this.setState({ errMessage: res.errMessage });
            }
        } catch (error) {
            this.setState({ isLoading: false });
            if (error.response && error.response.data) {
                this.setState({ errMessage: error.response.data.errMessage });
            } else {
                this.setState({ errMessage: "Error from server!" });
            }
        }
    }

    handleVerifyAndReset = async () => {
        this.setState({ errMessage: '' });
        let { email, otp, newPassword, confirmPassword } = this.state;
        let language = this.props.language;

        if (!otp || !newPassword || !confirmPassword) {
            this.setState({ errMessage: language === 'vi' ? "Vui lòng điền đầy đủ thông tin!" : "Please fill in all fields!" });
            return;
        }

        if (newPassword !== confirmPassword) {
            this.setState({ errMessage: language === 'vi' ? "Mật khẩu không khớp!" : "Passwords do not match!" });
            return;
        }

        this.setState({ isLoading: true });
        try {
            let res = await verifyForgotPasswordService({ email, otp, newPassword });
            this.setState({ isLoading: false });
            
            if (res && res.errCode === 0) {
                toast.success(language === 'vi' ? "Đổi mật khẩu thành công!" : "Password changed successfully!");
                this.props.navigate('/user-login');
            } else {
                this.setState({ errMessage: res.errMessage });
            }
        } catch (error) {
            this.setState({ isLoading: false });
            if (error.response && error.response.data) {
                this.setState({ errMessage: error.response.data.errMessage });
            } else {
                this.setState({ errMessage: "Error from server!" });
            }
        }
    }

    render() {
        let { step, email, otp, newPassword, confirmPassword, isShowPassword, errMessage, isLoading } = this.state;
        let language = this.props.language;

        return (
            <div className="forgot-password-background">
                <div className="forgot-password-container">
                    <div className="forgot-password-content row notranslate">
                        <div className="col-12 text-center forgot-password-title">
                            {language === 'vi' ? 'Quên mật khẩu' : 'Forgot Password'}
                        </div>

                        {step === 1 &&
                            <>
                                <div className="col-12 forgot-password-desc">
                                    {language === 'vi' ? 'Nhập email của bạn để nhận mã xác nhận đổi mật khẩu.' : 'Enter your email to receive a password reset verification code.'}
                                </div>
                                <div className="col-12 form-group forgot-password-input">
                                    <label>Email (*)</label>
                                    <input type="email" className="form-control" placeholder={language === 'vi' ? "Nhập email của bạn" : "Enter your email"}
                                        value={email} onChange={(event) => this.handleOnChangeInput(event, 'email')} />
                                </div>
                                {errMessage &&
                                    <div className="col-12" style={{ color: 'red', marginBottom: '15px' }}>
                                        {errMessage}
                                    </div>
                                }
                                <div className="col-12">
                                    <button className="btn-submit" onClick={() => this.handleSendCode()} disabled={isLoading}>
                                        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : (language === 'vi' ? 'Gửi mã xác nhận' : 'Send Code')}
                                    </button>
                                </div>
                            </>
                        }

                        {step === 2 &&
                            <>
                                <div className="col-12 forgot-password-desc">
                                    {language === 'vi' ? `Mã xác nhận đã được gửi đến ${email}. Vui lòng kiểm tra hộp thư.` : `Verification code sent to ${email}. Please check your inbox.`}
                                </div>
                                <div className="col-12 form-group forgot-password-input">
                                    <label>{language === 'vi' ? 'Mã xác nhận (OTP) (*)' : 'Verification Code (OTP) (*)'}</label>
                                    <input type="text" className="form-control" placeholder={language === 'vi' ? "Nhập mã 6 chữ số" : "Enter 6-digit code"}
                                        value={otp} onChange={(event) => this.handleOnChangeInput(event, 'otp')} />
                                </div>
                                <div className="col-12 form-group forgot-password-input">
                                    <label>{language === 'vi' ? 'Mật khẩu mới (*)' : 'New Password (*)'}</label>
                                    <div className='custom-input-password'>
                                        <input type={isShowPassword ? "text" : "password"} className="form-control" placeholder={language === 'vi' ? "Nhập mật khẩu mới" : "Enter new password"}
                                            value={newPassword} onChange={(event) => this.handleOnChangeInput(event, 'newPassword')} />
                                        <span onClick={() => this.handleShowHidePassword()}>
                                            <i className={isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="col-12 form-group forgot-password-input">
                                    <label>{language === 'vi' ? 'Xác nhận mật khẩu mới (*)' : 'Confirm New Password (*)'}</label>
                                    <div className='custom-input-password'>
                                        <input type={isShowPassword ? "text" : "password"} className="form-control" placeholder={language === 'vi' ? "Nhập lại mật khẩu mới" : "Re-enter new password"}
                                            value={confirmPassword} onChange={(event) => this.handleOnChangeInput(event, 'confirmPassword')} />
                                    </div>
                                </div>
                                {errMessage &&
                                    <div className="col-12" style={{ color: 'red', marginBottom: '15px' }}>
                                        {errMessage}
                                    </div>
                                }
                                <div className="col-12">
                                    <button className="btn-submit" onClick={() => this.handleVerifyAndReset()} disabled={isLoading}>
                                        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : (language === 'vi' ? 'Đổi mật khẩu' : 'Change Password')}
                                    </button>
                                </div>
                                <div className="col-12 text-center mt-3">
                                    <span className="login-link" onClick={() => this.setState({ step: 1, errMessage: '' })}>
                                        {language === 'vi' ? 'Quay lại' : 'Go back'}
                                    </span>
                                </div>
                            </>
                        }

                        <div className="col-12 text-center mt-3">
                            <span className="login-link" onClick={() => this.props.navigate('/user-login')}>
                                {language === 'vi' ? 'Quay lại trang Đăng nhập' : 'Back to Login page'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
