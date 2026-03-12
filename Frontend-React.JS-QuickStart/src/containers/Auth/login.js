import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../services/userService';
import { divide } from 'lodash';


class Login extends Component {
    constructor(props) {
        super(props);
        // Khởi tạo State (bộ nhớ)
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: ''
        }
    }
    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleLogin = async () => {
        this.setState({ errMessage: '' })

        try {
            let data = await handleLoginApi(this.state.username, this.state.password);

            // 1. MÁY QUÉT: In ra xem vỏ ngoài của dữ liệu trông như thế nào
            console.log(">>> CHECK RAW DATA TỪ BACKEND: ", data);

            // 2. LỘT VỎ: Nếu thư viện bọc thêm lớp data bên ngoài thì mình lột nó ra
            let realData = data && data.data ? data.data : data;

            // 3. Xử lý như bình thường với cục dữ liệu đã lột vỏ
            if (realData && realData.errCode !== 0) {
                this.setState({
                    errMessage: realData.message
                });
            }

            if (realData && realData.errCode === 0) {
                console.log(">>> Đã vào được IF thành công, chuẩn bị chuyển trang!");
                this.props.userLoginSuccess(realData.user);
            }

        } catch (error) {
            console.log(">>> LỖI CATCH:", error);
            if (error.response && error.response.data) {
                this.setState({
                    errMessage: error.response.data.message
                });
            }
        }
    }
    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    render() {
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row">

                        {/* Tiêu đề */}
                        <div className="col-12 text-center login-title">
                            Login
                        </div>

                        {/* Ô nhập Username */}
                        <div className="col-12 form-group login-input">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your username"
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeUsername(event)}
                            />
                        </div>

                        {/* Ô nhập Password */}
                        <div className="col-12 form-group login-input">
                            <label>Password</label>
                            <div className='custom-input-password'>
                                <input
                                    type={this.state.isShowPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangePassword(event)}
                                />
                                <span onClick={() => this.handleShowHidePassword()}>
                                    <i className={this.state.isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </span>
                            </div>
                        </div>

                        {this.state.errMessage &&
                            <div className="col-12" style={{ color: 'red', marginTop: '10px' }}>
                                {this.state.errMessage}
                            </div>
                        }
                        <div className="col-12">
                            <button className="btn-login" onClick={() => this.handleLogin()}>Log in</button>
                        </div>

                        <div className="col-12 text-center mt-2">
                            <span className="forgot-password">Forgot your password?</span>
                        </div>

                        {/* Chữ chuyển hướng */}
                        <div className="col-12 text-center mt-3">
                            <span className="text-other-login">Or sign in with:</span>
                        </div>

                        {/* Mạng xã hội (Dùng icon của FontAwesome) */}
                        <div className="col-12 social-login text-center mt-2">
                            <i className="fab fa-facebook-f"></i>
                            <i className="fab fa-twitter"></i>
                            <i className="fab fa-google-plus-g"></i>
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
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
        //userLoginFail: () => dispatch(actions.userLoginFail()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
