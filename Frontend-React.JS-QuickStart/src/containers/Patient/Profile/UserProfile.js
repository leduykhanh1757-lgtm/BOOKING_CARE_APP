import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './UserProfile.scss';
import { editUserService, getAllUsers } from '../../../services/userService'; // 🛠️ Import thêm getAllUsers[cite: 9]
import { toast } from 'react-toastify';
import CommonUtils from '../../../utils/CommonUtils';
import * as actions from '../../../store/actions';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            roleId: '',     // 🛠️ Thêm 2 cái này để hứng data từ DB
            positionId: '', // 🛠️ Tránh lỗi Missing Parameter
            avatar: '',
            previewImgURL: ''
        }
    }

    async componentDidMount() {
        await this.fetchUserDataFromBackend();
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.userInfo !== this.props.userInfo) {
            await this.fetchUserDataFromBackend();
        }
    }

    // 🛠️ HÀM LẤY DATA "CHUẨN" TỪ BACKEND[cite: 9]
    fetchUserDataFromBackend = async () => {
        let { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            // Lấy data full trực tiếp từ Database thay vì dùng Redux[cite: 9]
            let res = await getAllUsers(userInfo.id);
            if (res && res.errCode === 0 && res.users) {
                let user = res.users;
                let imageBase64 = '';

                if (user.image) {
                    imageBase64 = new Buffer(user.image, 'base64').toString('binary');
                }

                this.setState({
                    email: user.email || '',
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    phoneNumber: user.phoneNumber || '',
                    address: user.address || '',
                    gender: user.gender || 'M',
                    roleId: user.roleId || '',         // Lấy roleId để tí nữa gửi trả Backend
                    positionId: user.positionId || '', // Lấy positionId để tí nữa gửi trả Backend
                    avatar: imageBase64,
                    previewImgURL: imageBase64
                });
            }
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
            });
        }
    }

    handleSaveUser = async () => {
        let { userInfo } = this.props;

        // 🛠️ BƠM ĐỦ THAM SỐ CHO BACKEND[cite: 9]
        let res = await editUserService({
            id: userInfo.id,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            gender: this.state.gender,
            roleId: this.state.roleId,         // Gửi trả lại roleId
            positionId: this.state.positionId, // Gửi trả lại positionId
            avatar: this.state.avatar
        });

        if (res && res.errCode === 0) {
            toast.success("Cập nhật thông tin thành công!");

            // Cập nhật Redux để Header đổi avatar ngay lập tức
            this.props.userLoginSuccess({
                ...userInfo,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                image: this.state.avatar
            });
        } else {
            toast.error("Lỗi cập nhật: " + res.errMessage);
        }
    }

    render() {
        let { email, firstName, lastName, phoneNumber, address, gender, previewImgURL } = this.state;

        return (
            <div className="user-profile-container">
                <HomeHeader isShowBanner={false} />

                <div className="profile-body">
                    <div className="profile-card">
                        <h2>Thông tin tài khoản</h2>

                        <div className="profile-info">
                            <div className="avatar-section">
                                <div
                                    className="avatar-preview"
                                    style={{ backgroundImage: `url(${previewImgURL ? previewImgURL : ''})` }}
                                ></div>
                                <input
                                    id="previewImg"
                                    type="file"
                                    hidden
                                    onChange={(event) => this.handleOnChangeImage(event)}
                                />
                                <label htmlFor="previewImg" className="btn-change-avatar">Thay đổi ảnh</label>
                            </div>

                            <div className="details-section">
                                <div className="form-group">
                                    <label>Email đăng nhập (Không thể đổi)</label>
                                    <input type="email" value={email} disabled />
                                </div>

                                <div className="form-group row-group">
                                    <div className="col">
                                        <label>Họ và tên đệm</label>
                                        <input
                                            type="text" value={firstName}
                                            onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Tên</label>
                                        <input
                                            type="text" value={lastName}
                                            onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row-group">
                                    <div className="col">
                                        <label>Số điện thoại</label>
                                        <input
                                            type="text" value={phoneNumber}
                                            onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                        />
                                    </div>
                                    <div className="col">
                                        <label>Giới tính</label>
                                        <select
                                            className="form-control custom-select"
                                            value={gender}
                                            onChange={(event) => this.handleOnChangeInput(event, 'gender')}
                                        >
                                            <option value="M">Nam</option>
                                            <option value="F">Nữ</option>
                                            <option value="O">Khác</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Địa chỉ liên hệ</label>
                                    <input
                                        type="text" value={address}
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    />
                                </div>

                                <button className="btn-update" onClick={() => this.handleSaveUser()}>
                                    Cập nhật thông tin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);