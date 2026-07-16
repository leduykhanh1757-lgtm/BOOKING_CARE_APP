import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import './UserRegister.scss';
import { createNewUserService, getAllCodeService } from '../../services/userService';
import { toast } from 'react-toastify';

class UserRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            genderArr: [],
            isShowPassword: false,
            errMessage: ''
        }
    }

    async componentDidMount() {
        try {
            let res = await getAllCodeService('GENDER');
            if (res && res.errCode === 0) {
                this.setState({
                    genderArr: res.data,
                    gender: res.data && res.data.length > 0 ? res.data[0].keyMap : ''
                })
            }
        } catch (error) {
            console.log("Error fetching genders: ", error);
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

    handleRegister = async () => {
        this.setState({ errMessage: '' })
        let { email, password, firstName, lastName, phoneNumber, address, gender } = this.state;
        
        // Simple Validation
        if (!email || !password || !firstName || !lastName || !phoneNumber || !address) {
            this.setState({ errMessage: "Please fill out all required fields!" });
            return;
        }

        try {
            let res = await createNewUserService({
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                address,
                gender,
                roleId: 'R3', // Role Patient
                positionId: 'P0',
                avatar: ''
            });

            if (res && res.errCode !== 0) {
                this.setState({ errMessage: res.errMessage });
                toast.error(res.errMessage);
            } else {
                toast.success("Account created successfully!");
                this.props.navigate('/user-login');
            }

        } catch (error) {
            if (error.response && error.response.data) {
                this.setState({ errMessage: error.response.data.errMessage });
            } else {
                toast.error("Registration failed!");
            }
        }
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleRegister();
        }
    }

    render() {
        let { email, password, firstName, lastName, phoneNumber, address, gender, genderArr, isShowPassword, errMessage } = this.state;
        let language = this.props.language;

        return (
            <div className="register-background">
                <div className="register-container">
                    <div className="register-content row notranslate">
                        <div className="col-12 text-center register-title">
                            Register Account
                        </div>

                        <div className="col-6 form-group register-input">
                            <label>First Name (*)</label>
                            <input type="text" className="form-control" placeholder="Enter first name"
                                value={firstName} onChange={(event) => this.handleOnChangeInput(event, 'firstName')} />
                        </div>
                        
                        <div className="col-6 form-group register-input">
                            <label>Last Name (*)</label>
                            <input type="text" className="form-control" placeholder="Enter last name"
                                value={lastName} onChange={(event) => this.handleOnChangeInput(event, 'lastName')} />
                        </div>

                        <div className="col-12 form-group register-input">
                            <label>Email (*)</label>
                            <input type="email" className="form-control" placeholder="Enter your email"
                                value={email} onChange={(event) => this.handleOnChangeInput(event, 'email')} />
                        </div>

                        <div className="col-12 form-group register-input">
                            <label>Password (*)</label>
                            <div className='custom-input-password'>
                                <input type={isShowPassword ? "text" : "password"} className="form-control" placeholder="Enter your password"
                                    value={password} onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                    onKeyDown={(event) => this.handleKeyDown(event)} />
                                <span onClick={() => this.handleShowHidePassword()}>
                                    <i className={isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </span>
                            </div>
                        </div>

                        <div className="col-6 form-group register-input">
                            <label>Phone Number (*)</label>
                            <input type="text" className="form-control" placeholder="Enter phone number"
                                value={phoneNumber} onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')} />
                        </div>

                        <div className="col-6 form-group register-input">
                            <label>Gender (*)</label>
                            <select className="form-select" value={gender} onChange={(event) => this.handleOnChangeInput(event, 'gender')}>
                                {genderArr && genderArr.length > 0 &&
                                    genderArr.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === 'vi' ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className="col-12 form-group register-input">
                            <label>Address (*)</label>
                            <input type="text" className="form-control" placeholder="Enter address"
                                value={address} onChange={(event) => this.handleOnChangeInput(event, 'address')} 
                                onKeyDown={(event) => this.handleKeyDown(event)} />
                        </div>

                        {errMessage &&
                            <div className="col-12" style={{ color: 'red', marginTop: '10px' }}>
                                {errMessage}
                            </div>
                        }

                        <div className="col-12">
                            <button className="btn-register" onClick={() => this.handleRegister()}>Register</button>
                        </div>

                        <div className="col-12 text-center mt-3">
                            <span className="login-link" onClick={() => this.props.navigate('/user-login')}>Already have an account? Log in</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserRegister);
