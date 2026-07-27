import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { languages, CRUD_actions, CommonUtils } from '../../../utils';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManageUser from './TableManageUser';

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
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
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
        let file = data[0];

        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);

            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
            })
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true
        })
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (isValid === false) return;

        let { action } = this.state;

        if (action === CRUD_actions.CREATE) {
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
            this.props.editUserRedux({
                id: this.state.userEditId,
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
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'firstName', 'lastName', 'phoneNumber', 'address'];

        // Nếu ở chế độ Tạo mới thì cần validate mật khẩu
        if (this.state.action === CRUD_actions.CREATE) {
            arrCheck.push('password');
        }

        for (let i = 0; i < arrCheck.length; i++) {
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
            if (typeof user.image === 'string') {
                imageBase64 = user.image;
            } else if (user.image.data) {
                imageBase64 = new Buffer(user.image.data).toString('binary');
            } else {
                imageBase64 = new Buffer(user.image, 'base64').toString('binary');
            }
        }

        this.setState({
            email: user.email || '',
            password: 'HARDCODE_PASSWORD',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phoneNumber: user.phonenumber || user.phoneNumber || '',
            address: user.address || '',
            gender: user.gender || '',
            position: user.positionId || '',
            role: user.roleId || '',
            avatar: imageBase64,
            previewImgURL: imageBase64,

            action: CRUD_actions.EDIT,
            userEditId: user.id
        });
    }

    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        let isLoadingGender = this.props.isLoadingGender;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;

        let { email, password,
            firstName, lastName, phoneNumber, address,
            gender, position, role } = this.state;

        return (
            <div className='user-redux-container'>
                <div className="title text-center mt-3">
                    <FormattedMessage id="manage-user.add" defaultMessage="Quản lý người dùng" />
                </div>

                <div className="user-redux-body">
                    <div className='container'>
                        <div className='row'>
                            <div className="col-12 my-3">
                                <strong>
                                    {this.state.action === CRUD_actions.EDIT ? 'Chỉnh sửa thông tin người dùng' : 'Thêm mới người dùng'}
                                </strong>
                            </div>

                            {/* --- DÒNG 1 --- */}
                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control"
                                    value={email}
                                    onChange={(event) => { this.onChangeInput(event, 'email') }}
                                    disabled={this.state.action === CRUD_actions.EDIT}
                                />
                            </div>
                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Mật khẩu</label>
                                <input type="password" className="form-control"
                                    value={password}
                                    onChange={(event) => { this.onChangeInput(event, 'password') }}
                                    disabled={this.state.action === CRUD_actions.EDIT}
                                />
                            </div>
                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Tên (First name)</label>
                                <input type="text" className="form-control"
                                    value={firstName}
                                    onChange={(event) => { this.onChangeInput(event, 'firstName') }}
                                />
                            </div>
                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Họ (Last name)</label>
                                <input type="text" className="form-control"
                                    value={lastName}
                                    onChange={(event) => { this.onChangeInput(event, 'lastName') }}
                                />
                            </div>

                            {/* --- DÒNG 2 --- */}
                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Số điện thoại</label>
                                <input type="text" className="form-control"
                                    value={phoneNumber}
                                    onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }}
                                />
                            </div>
                            <div className="col-9 mb-3 form-group">
                                <label className="form-label">Địa chỉ</label>
                                <input type="text" className="form-control"
                                    value={address}
                                    onChange={(event) => { this.onChangeInput(event, 'address') }}
                                />
                            </div>

                            {/* --- DÒNG 3 --- */}
                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Giới tính</label>
                                <select className="form-control"
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

                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Chức danh (Position)</label>
                                <select className="form-control"
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

                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Vai trò (Role)</label>
                                <select className="form-control"
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

                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Ảnh đại diện (Avatar)</label>
                                <div className="preview-img-container">
                                    <input id='previewImg' type="file" hidden
                                        onChange={(event) => this.handleonChangeImg(event)}
                                    />
                                    <label className="label-upload" htmlFor='previewImg'>
                                        Tải ảnh <i className="fas fa-upload"></i>
                                    </label>

                                    <div className='preview-image'
                                        style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                        onClick={() => this.openPreviewImage()}
                                    />
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
                                    {this.state.action === CRUD_actions.CREATE ? 'Lưu người dùng' : 'Cập nhật thông tin'}
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
