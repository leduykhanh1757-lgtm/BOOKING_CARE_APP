import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../../services/userService';
import { languages, CRUD_actions, CommonUtils } from '../../../utils';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManageUser from './TableManageUser';
import { set } from 'lodash';

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',

            action: CRUD_actions.CREATE, // Mặc định vừa vào form là chế độ Tạo mới
            userEditId: '',              // Chỗ để lưu ID của user đang bị đem ra sửa
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
        if (prevProps.ListUsers !== this.props.ListUsers) {
            let arrUsers = this.props.ListUsers;
            let arrGenders = this.props.genderRedux;
            let arrPositions = this.props.positionRedux;
            let arrRoles = this.props.roleRedux;
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',

                avatar: '',
                previewImgURL: '',
                action: CRUD_actions.CREATE,
                userEditId: ''
            })
        }
    }

    handleonChangeImg = async (event) => {
        let data = event.target.files;
        let file = data[0]; // Lấy cái file đầu tiên mà người dùng chọn

        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            // Tạo một cái link ảo URL cho cái file đó
            let objectUrl = URL.createObjectURL(file);

            // Lưu link ảo vào previewImgURL để hiển thị, lưu file thật vào avatar
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
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

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;

        let { action } = this.state; // Lấy cái cờ ra kiểm tra xem đang ở chế độ CREATE hay EDIT

        if (action === CRUD_actions.CREATE) {
            // Nếu đang ở chế độ CREATE thì gọi action tạo mới
            this.props.createNewUserRedux({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar,
            });
        }

        if (action === CRUD_actions.EDIT) {
            // Nếu đang ở chế độ EDIT thì gọi action sửa
            this.props.editUserRedux({
                id: this.state.userEditId, // Đem ID của user đang sửa ra
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar,
            });
        }
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state }

        copyState[id] = event.target.value;

        this.setState({
            ...copyState,
        }, () => {
            console.log('check input state', this.state)
        })

    }

    checkValidateInput = () => {
        let isValid = true;

        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address'];

        for (let i = 0; i < arrCheck.length; i++) {
            // Nếu state của phần tử đó bị rỗng (falsy)
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('Vui lòng nhập đầy đủ thông tin: ' + arrCheck[i]);
                break;
            }
        }
        return isValid;
    }

    handleEditUserFromParent = (user) => {
        let imageBase64 = '';

        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }

        this.setState({
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            position: user.positionId,
            role: user.roleId,
            avatar: '',
            previewImgURL: imageBase64,

            action: CRUD_actions.EDIT,
            userEditId: user.id
        })
    }

    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        let isLoadingGender = this.props.isLoadingGender;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;

        let { email, password,
            firstName, lastName, phoneNumber, address,
            gender, position, role, avatar } = this.state;

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
                                <input type="email" className="form-control"
                                    value={email}
                                    onChange={(event) => { this.onChangeInput(event, 'email') }}
                                    disabled={this.state.action === CRUD_actions.EDIT ? true : false}
                                />
                            </div>
                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.password" defaultMessage="Password" />
                                </label>
                                <input type="password" className="form-control"
                                    value={password}
                                    onChange={(event) => { this.onChangeInput(event, 'password') }}
                                    disabled={this.state.action === CRUD_actions.EDIT ? true : false}
                                />
                            </div>
                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.first-name" defaultMessage="First name" />
                                </label>
                                <input type="text" className="form-control"
                                    value={firstName}
                                    onChange={(event) => { this.onChangeInput(event, 'firstName') }}
                                />
                            </div>
                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.last-name" defaultMessage="Last name" />
                                </label>
                                <input type="text" className="form-control"
                                    value={lastName}
                                    onChange={(event) => { this.onChangeInput(event, 'lastName') }}
                                />
                            </div>

                            {/* --- DÒNG 2 --- */}
                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.phone-number" defaultMessage="Phone number" />
                                </label>
                                <input type="text" className="form-control"
                                    value={phoneNumber}
                                    onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }}
                                />
                            </div>
                            <div className="col-9 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.address" defaultMessage="Address" />
                                </label>
                                <input type="text" className="form-control"
                                    value={address}
                                    onChange={(event) => { this.onChangeInput(event, 'address') }}
                                />
                            </div>

                            {/* --- DÒNG 3 --- */}

                            {/* 1. Ô GENDER (Đang gọi từ Redux) */}
                            <div className="col-3 mb-3">
                                <label className="form-label">
                                    <FormattedMessage id="manage-user.gender" defaultMessage="Gender" />
                                </label>
                                <select className="form-select"
                                    onChange={(event) => { this.onChangeInput(event, 'gender') }}
                                    value={gender}
                                >
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
                                <select className="form-select"
                                    onChange={(event) => { this.onChangeInput(event, 'position') }}
                                    value={position}
                                >
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
                                <select className="form-select"
                                    onChange={(event) => { this.onChangeInput(event, 'role') }}
                                    value={role}
                                >
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
                                        onChange={(event) => this.handleonChangeImg(event)}

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
                                <button className={this.state.action === CRUD_actions.CREATE ? "btn btn-primary" : "btn btn-warning"}
                                    onClick={() => this.handleSaveUser()}
                                >
                                    {this.state.action === CRUD_actions.CREATE ?
                                        <FormattedMessage id="manage-user.save" defaultMessage="Save user" />
                                        :
                                        <FormattedMessage id="manage-user.update" defaultMessage="Update user" />
                                    }
                                </button>
                            </div>
                            <div className="col-12 mt-5 mb-5">
                                <TableManageUser
                                    handleEditUserFromParentKey={this.handleEditUserFromParent}
                                    action={this.state.action}
                                />
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
        ListUsers: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUserRedux: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUser()),
        editUserRedux: (data) => dispatch(actions.editUser(data)),
        deleteUserRedux: (id) => dispatch(actions.deleteUser(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
