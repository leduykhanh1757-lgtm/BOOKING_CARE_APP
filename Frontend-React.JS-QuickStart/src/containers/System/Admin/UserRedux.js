import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../../services/userService';
import { languages } from '../../../utils';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            avatar: ' ',
            previewImgURL: '',
            isOpen: false,
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // So sánh: Nếu Props của quá khứ (prevProps) KHÁC với Props hiện tại (this.props)
        // Tức là Redux vừa mới bơm dữ liệu mới sang
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                // Chọn sẵn mặc định thằng đầu tiên (Male) cho ô dropdown đỡ bị trống
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }

        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }

        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            })
        }
    }

    handleOnchangeImg = (event) => {
        let data = event.target.files;
        let file = data[0]; // Lấy cái file đầu tiên mà người dùng chọn

        if (file) {
            // Tạo một cái link ảo URL cho cái file đó
            let objectUrl = URL.createObjectURL(file);

            // Lưu link ảo vào previewImgURL để hiển thị, lưu file thật vào avatar
            this.setState({
                previewImgURL: objectUrl,
                avatar: file
            })
        }
    }

    openPreviewImage = () => {
        // Nếu chưa có ảnh (previewImgURL rỗng) thì bấm vào không có tác dụng gì cả
        if (!this.state.previewImgURL) return;

        // Nếu có ảnh rồi thì bật cờ lên
        this.setState({
            isOpen: true
        })
    }
    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        let isLoadingGender = this.props.isLoadingGender;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;

        return (
            <div className='user-redux-container'>
                <div className="title text-center mt-3" >
                    <FormattedMessage id="manage-user.add" />
                </div>
                <div className="text-center">
                    {/* In ra chữ Loading để test */}
                    {isLoadingGender === true ? 'Loading gender...' : ''}
                </div>
                <div className="user-redux-body" >
                    <div className='container'>
                        <div className='row'>

                            <div className="col-12 my-3">
                                <strong><FormattedMessage id="manage-user.add" defaultMessage="Add a new user" /></strong>
                            </div>

                            {/* --- DÒNG 1 --- */}
                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.email" defaultMessage="Email" />
                                </label>
                                <input type="email" className="form-control" />
                            </div>
                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.password" defaultMessage="Password" />
                                </label>
                                <input type="password" className="form-control" />
                            </div>
                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.first-name" defaultMessage="First name" />
                                </label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.last-name" defaultMessage="Last name" />
                                </label>
                                <input type="text" className="form-control" />
                            </div>

                            {/* --- DÒNG 2 --- */}
                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.phone-number" defaultMessage="Phone number" />
                                </label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="col-9 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.address" defaultMessage="Address" />
                                </label>
                                <input type="text" className="form-control" />
                            </div>

                            {/* --- DÒNG 3 --- */}

                            {/* 1. Ô GENDER (Đang gọi từ Redux) */}
                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.gender" defaultMessage="Gender" />
                                </label>
                                <select className="form-select">
                                    {genders && genders.length > 0 && genders.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === 'vi' ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>

                            {/* Ô POSITION */}
                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.position" defaultMessage="Position" />
                                </label>
                                <select className="form-select">
                                    {positions && positions.length > 0 && positions.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === 'vi' ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>

                            {/* Ô ROLE  */}
                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.role" defaultMessage="Role" />
                                </label>
                                <select className="form-select">
                                    {roles && roles.length > 0 && roles.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === 'vi' ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.image" defaultMessage="Avatar" />
                                </label>
                                <div className="preview-img-container">
                                    {/* Thêm chữ hidden để giấu nút mặc định đi */}
                                    <input id='previewImg' type="file" hidden
                                        onChange={(event) => this.handleOnchangeImg(event)}

                                    />

                                    {/* Thêm class label-upload và icon */}
                                    <label className="label-upload" htmlFor='previewImg'>
                                        Tải ảnh <i className="fas fa-upload"></i>
                                    </label>

                                    {/* Khung hiển thị ảnh xem trước */}
                                    <div className='preview-image'
                                        style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                        onClick={() => this.openPreviewImage()}
                                    >

                                    </div>
                                    {this.state.isOpen === true &&
                                        <Lightbox
                                            mainSrc={this.state.previewImgURL}
                                            onCloseRequest={() => this.setState({ isOpen: false })}
                                        />
                                    }
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <button className="btn btn-primary">
                                    <FormattedMessage id="manage-user.save" defaultMessage="Save user" />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
