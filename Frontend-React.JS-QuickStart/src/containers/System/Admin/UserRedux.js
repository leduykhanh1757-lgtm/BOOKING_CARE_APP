import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { languages, CRUD_actions, CommonUtils } from '../../../utils';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import CustomLoadingOverlay from '../../../components/CustomLoadingOverlay';
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

            action: CRUD_actions.CREATE, // Mặc định vừa vào trang là chế độ Thêm mới (Form trống)
            userEditId: '',
            isLoading: false,
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
                gender: ''
            })
        }

        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: ''
            })
        }

        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: ''
            })
        }

        // Khi danh sách User trong Redux thay đổi (sau khi Thêm/Sửa/Xóa thành công)
        // Reset form về lại trạng thái ban đầu (Rỗng) và chuyển cờ về CREATE
        if (prevProps.ListUsers !== this.props.ListUsers) {
            this.setState({
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
                previewImgURL: '',
                action: CRUD_actions.CREATE,
                userEditId: '',
                isLoading: false,
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

    handleSaveUser = async () => {
        if (this.state.isLoading) return; // Chặn double-click

        let isValid = this.checkValidateInput();
        if (isValid === false) return;

        this.setState({ isLoading: true });

        let { action } = this.state;
        let positionToSave = this.state.role === 'R2' ? (this.state.position || 'P0') : 'P0';

        let userData = {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            gender: this.state.gender,
            roleId: this.state.role,
            positionId: positionToSave,
            avatar: this.state.avatar,
        };

        try {
            if (action === CRUD_actions.CREATE) {
                await this.props.createNewUserRedux(userData);
            }

            if (action === CRUD_actions.EDIT) {
                await this.props.editUserRedux({
                    ...userData,
                    id: this.state.userEditId,
                });
            }
        } catch (e) {
            console.error('handleSaveUser error:', e);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;

        if (id === 'role') {
            if (event.target.value !== 'R2') {
                copyState['position'] = 'P0';
            } else if (!copyState['position'] || copyState['position'] === 'P0') {
                copyState['position'] = 'P1';
            }
        }

        this.setState({
            ...copyState,
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'firstName', 'lastName', 'phoneNumber', 'address', 'gender', 'role'];

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

    // Hàm nhận dữ liệu khi bấm nút BÚT CHÌ ở bảng bên dưới
    handleEditUserFromParent = (user) => {
        let imageBase64 = '';
        if (user && user.image) {
            if (typeof user.image === 'string') {
                imageBase64 = user.image;
            } else if (user.image.data && Array.isArray(user.image.data)) {
                try {
                    imageBase64 = new TextDecoder('utf-8').decode(new Uint8Array(user.image.data));
                } catch (e) {
                    console.error('Error decoding image array:', e);
                }
            } else if (typeof user.image === 'object') {
                try {
                    let arr = user.image.data || user.image;
                    if (Array.isArray(arr)) {
                        imageBase64 = new TextDecoder('utf-8').decode(new Uint8Array(arr));
                    }
                } catch (e) {
                    console.error('Error decoding image object:', e);
                }
            }
        }

        this.setState({
            email: user.email || '',
            password: 'HARDCODE_PASSWORD',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phoneNumber: user.phoneNumber || user.phonenumber || '',
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
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;

        let { email, password,
            firstName, lastName, phoneNumber, address,
            gender, position, role, isLoading } = this.state;

        return (
            <CustomLoadingOverlay active={isLoading} text={this.state.action === CRUD_actions.CREATE ? "Đang tạo người dùng mới..." : "Đang cập nhật người dùng..."}>
                <div className='user-redux-container'>
                <div className="title text-center">
                    QUẢN LÝ NGƯỜI DÙNG (ADMIN)
                </div>

                <div className="user-redux-body">
                    <div className='container'>
                        <div className='row'>
                            <div className="col-12 my-3">
                                <strong>
                                    {this.state.action === CRUD_actions.EDIT
                                        ? 'Chỉnh sửa thông tin người dùng'
                                        : 'Thêm mới người dùng'}
                                </strong>
                            </div>

                            {/* --- DÒNG 1 --- */}
                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control"
                                    placeholder={language === 'vi' ? "Nhập địa chỉ email..." : "Enter email address..."}
                                    value={email}
                                    onChange={(event) => { this.onChangeInput(event, 'email') }}
                                    disabled={this.state.action === CRUD_actions.EDIT || isLoading}
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Mật khẩu</label>
                                <input type="password" className="form-control"
                                    placeholder={language === 'vi' ? "Nhập mật khẩu..." : "Enter password..."}
                                    value={password}
                                    onChange={(event) => { this.onChangeInput(event, 'password') }}
                                    disabled={this.state.action === CRUD_actions.EDIT || isLoading}
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Tên (First name)</label>
                                <input type="text" className="form-control"
                                    placeholder={language === 'vi' ? "Nhập tên..." : "Enter first name..."}
                                    value={firstName}
                                    onChange={(event) => { this.onChangeInput(event, 'firstName') }}
                                    autoComplete="off"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Họ (Last name)</label>
                                <input type="text" className="form-control"
                                    placeholder={language === 'vi' ? "Nhập họ..." : "Enter last name..."}
                                    value={lastName}
                                    onChange={(event) => { this.onChangeInput(event, 'lastName') }}
                                    autoComplete="off"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* --- DÒNG 2 --- */}
                            <div className="col-3 mb-3 form-group">
                                <label className="form-label">Số điện thoại</label>
                                <input type="text" className="form-control"
                                    placeholder={language === 'vi' ? "Nhập số điện thoại..." : "Enter phone number..."}
                                    value={phoneNumber}
                                    onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }}
                                    autoComplete="off"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="col-9 mb-3 form-group">
                                <label className="form-label">Địa chỉ</label>
                                <input type="text" className="form-control"
                                    placeholder={language === 'vi' ? "Nhập địa chỉ chi tiết..." : "Enter full address..."}
                                    value={address}
                                    onChange={(event) => { this.onChangeInput(event, 'address') }}
                                    autoComplete="off"
                                    disabled={isLoading}
                                />
                            </div>

                            {/* --- DÒNG 3 --- */}
                            <div className="col-4 mb-3 form-group">
                                <label className="form-label">Giới tính</label>
                                <select className="form-control"
                                    onChange={(event) => { this.onChangeInput(event, 'gender') }}
                                    value={gender}
                                    disabled={isLoading}
                                >
                                    <option value="">{language === 'vi' ? '--- Chọn giới tính ---' : '--- Select gender ---'}</option>
                                    {genders && genders.length > 0 && genders.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === 'vi' ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="col-4 mb-3 form-group">
                                <label className="form-label">Chức danh (Position)</label>
                                <select className="form-control"
                                    onChange={(event) => { this.onChangeInput(event, 'position') }}
                                    value={role !== 'R2' ? 'P0' : position}
                                    disabled={isLoading || role !== 'R2'}
                                >
                                    {role !== 'R2' ? (
                                        <option value="P0">
                                            {language === 'vi' ? 'Không có' : 'None'}
                                        </option>
                                    ) : (
                                        positions && positions.length > 0 && positions.map((item, index) => {
                                            let label = language === 'vi' ? item.valueVi : item.valueEn;
                                            if (item.keyMap === 'P0') {
                                                label = language === 'vi' ? 'Không có' : 'None';
                                            }
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {label}
                                                </option>
                                            )
                                        })
                                    )}
                                </select>
                            </div>

                            <div className="col-4 mb-3 form-group">
                                <label className="form-label">Vai trò (Role)</label>
                                <select className="form-control"
                                    onChange={(event) => { this.onChangeInput(event, 'role') }}
                                    value={role}
                                    disabled={isLoading}
                                >
                                    <option value="">{language === 'vi' ? '--- Chọn vai trò ---' : '--- Select role ---'}</option>
                                    {roles && roles.length > 0 && roles.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === 'vi' ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>

                            {/* --- DÒNG 4 --- */}
                            <div className="col-12 mb-3 form-group">
                                <label className="form-label">Ảnh đại diện (Avatar)</label>
                                <div className="preview-img-container">
                                    <input id='previewImg' type="file" hidden
                                        onChange={(event) => this.handleonChangeImg(event)}
                                        disabled={isLoading}
                                    />
                                    <label className="label-upload" htmlFor='previewImg'>
                                        Tải ảnh <i className="fas fa-upload"></i>
                                    </label>

                                    <div className='preview-image'
                                        style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                        onClick={() => this.openPreviewImage()}
                                    >
                                        {!this.state.previewImgURL && (
                                            <span className="preview-placeholder">
                                                <i className="fas fa-image"></i> Chưa chọn ảnh
                                            </span>
                                        )}
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
                                <button
                                    className={this.state.action === CRUD_actions.CREATE ? "btn btn-primary" : "btn btn-warning"}
                                    onClick={() => this.handleSaveUser()}
                                    disabled={isLoading}
                                >
                                    {this.state.action === CRUD_actions.CREATE ? 'Lưu người dùng' : 'Cập nhật người dùng'}
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
        </CustomLoadingOverlay>
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
