import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../store/actions";
import './Login.scss'; // Import CSS mới
import { handleLoginApi } from '../services/userService';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false, // 🛠️ Bổ sung thêm tính năng Ẩn/Hiện mật khẩu
            loginError: ''
        }
    }

    // Hàm dùng chung để lấy dữ liệu khi gõ phím
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    }

    // Bật tắt con mắt mật khẩu
    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    // 🛠️ HÀM XỬ LÝ ĐĂNG NHẬP CHÍNH
    processLogin = async () => {
        const { username, password } = this.state;
        const { userLoginSuccess } = this.props;

        this.setState({ loginError: '' });

        // Validate cơ bản
        if (!username || !password) {
            this.setState({ loginError: "Vui lòng nhập đầy đủ Tài khoản và Mật khẩu!" });
            return;
        }

        try {
            // 🛠️ Gọi thẳng xuống Node.js kiểm tra tài khoản
            let data = await handleLoginApi(username, password);
            let realData = data && data.data ? data.data : data;

            // Nếu sai tài khoản / mật khẩu
            if (realData && realData.errCode !== 0) {
                this.setState({ loginError: realData.message });
            }

            // Nếu thành công 100%
            if (realData && realData.errCode === 0) {
                // Giao toàn bộ data thật (có chứa firstName, lastName) cho Redux giữ
                userLoginSuccess(realData.user);

                // Chuyển trang vào hệ thống
                this.props.navigate('/system/user-manage');
            }
        } catch (error) {
            // Bắt lỗi Server sập hoặc mất mạng
            if (error.response && error.response.data) {
                this.setState({ loginError: error.response.data.message });
            } else {
                this.setState({ loginError: "Lỗi kết nối đến Server!" });
            }
        }
    }

    // Hỗ trợ bấm phím Enter để đăng nhập nhanh
    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.processLogin();
        }
    }

    render() {
        return (
            <div className="admin-login-background">
                <div className="admin-login-container">
                    <div className="login-content">
                        {/* Tiêu đề */}
                        <div className="text-center login-title">Đăng nhập Quản trị</div>

                        {/* Nhập Tài khoản */}
                        <div className="form-group login-input">
                            <label>Tài khoản Hệ thống</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tên đăng nhập..."
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeInput(event, 'username')}
                            />
                        </div>

                        {/* Nhập Mật khẩu */}
                        <div className="form-group login-input">
                            <label>Mật khẩu</label>
                            <div className="custom-input-password">
                                <input
                                    type={this.state.isShowPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Nhập mật khẩu..."
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                    onKeyDown={(event) => this.handleKeyDown(event)}
                                />
                                <span onClick={() => this.handleShowHidePassword()}>
                                    <i className={this.state.isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </span>
                            </div>
                        </div>

                        {/* Hiển thị Lỗi (nếu có) */}
                        {this.state.loginError &&
                            <div className="login-error-msg">
                                {this.state.loginError}
                            </div>
                        }

                        {/* Nút Đăng nhập */}
                        <button className="btn-login" onClick={() => this.processLogin()}>
                            Đăng nhập
                        </button>
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
        // userLoginFail: () => dispatch(actions.userLoginFail()), 
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);