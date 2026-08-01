import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './UserLogin.scss';
import '../../components/LoadingButton.scss';
import { handleLoginApi } from '../../services/userService';

class UserLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
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

    handleLogin = async () => {
        if (this.state.isLoading) return; // Chặn double-click

        this.setState({ errMessage: '', isLoading: true });

        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            let realData = data && data.data ? data.data : data;

            if (realData && realData.errCode !== 0) {
                this.setState({
                    errMessage: realData.message,
                    isLoading: false
                });
            }

            if (realData && realData.errCode === 0) {
                this.props.userLoginSuccess(realData.user);
                this.props.navigate('/home');
                // Không cần tắt loading vì sẽ redirect sang trang khác
            }

        } catch (error) {
            if (error.response && error.response.data) {
                this.setState({
                    errMessage: error.response.data.message,
                    isLoading: false
                });
            } else {
                this.setState({
                    errMessage: 'Lỗi kết nối đến máy chủ!',
                    isLoading: false
                });
            }
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handleKeyDown = (event) => {
        if (this.state.isLoading) return;
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleLogin();
        }
    }

    render() {
        let { username, password, isShowPassword, errMessage, isLoading } = this.state;

        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row notranslate">

                        <div className="col-12 text-center login-title">
                            Login
                        </div>

                        <div className="col-12 form-group login-input">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(event) => this.handleOnChangeInput(event, 'username')}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="col-12 form-group login-input">
                            <label>Password</label>
                            <div className='custom-input-password'>
                                <input
                                    type={isShowPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                    onKeyDown={(event) => this.handleKeyDown(event)}
                                    disabled={isLoading}
                                />
                                <span onClick={() => this.handleShowHidePassword()}>
                                    <i className={isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </span>
                            </div>
                        </div>

                        {errMessage &&
                            <div className="col-12" style={{ color: 'red', marginTop: '10px' }}>
                                {errMessage}
                            </div>
                        }
                        <div className="col-12">
                            <button
                                className={`btn-login ${isLoading ? 'btn-loading' : ''}`}
                                onClick={() => this.handleLogin()}
                                disabled={isLoading}
                            >
                                {isLoading && <span className="btn-spinner"></span>}
                                {isLoading ? 'Đang xử lý...' : 'Log in'}
                            </button>
                        </div>

                        <div className="col-12 text-center mt-2">
                            <span className="forgot-password" style={{ cursor: 'pointer' }}
                                  onClick={() => this.props.navigate('/forgot-password')}>
                                Forgot your password?
                            </span>
                        </div>

                        <div className="col-12 text-center mt-3">
                            <span className="text-other-login" style={{ cursor: 'pointer', color: '#2248bd', fontWeight: '600' }}
                                  onClick={() => this.props.navigate('/user-register')}>
                                Don't have an account? Register now
                            </span>
                        </div>

                        <div className="col-12 text-center mt-3">
                            <span className="text-other-login">Or sign in with:</span>
                        </div>

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
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);