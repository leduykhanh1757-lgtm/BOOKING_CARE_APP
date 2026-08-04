import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './UserProfile.scss';
import { editUserService, getAllUsers, createNewCommentApi, getCommentsByIdApi } from '../../../services/userService';
import { toast } from 'react-toastify';
import CommonUtils from '../../../utils/CommonUtils';
import CustomLoadingOverlay from '../../../components/CustomLoadingOverlay';

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
            roleId: '',
            positionId: '',
            avatar: '',
            previewImgURL: '',
            isFetching: true,
            isSaving: false,
            activeTab: 'PROFILE',
            patientReply: '',
            patientMessages: [],
            isLoadingComments: false
        }
    }

    async componentDidMount() {
        await this.fetchUserDataFromBackend();
        this.fetchRealDoctorComments(1);
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.userInfo?.id !== this.props.userInfo?.id) {
            await this.fetchUserDataFromBackend();
        }
    }

    fetchRealDoctorComments = async (doctorId) => {
        this.setState({ isLoadingComments: true });
        try {
            let res = await getCommentsByIdApi(doctorId || 1);
            if (res && res.errCode === 0 && res.comments) {
                let sortedMsgs = res.comments.slice().reverse();
                this.setState({ patientMessages: sortedMsgs, isLoadingComments: false });
            } else {
                this.setState({ patientMessages: [], isLoadingComments: false });
            }
        } catch (error) {
            console.error("Lỗi fetchRealDoctorComments:", error);
            this.setState({ patientMessages: [], isLoadingComments: false });
        }
    }

    fetchUserDataFromBackend = async () => {
        let { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            this.setState({ isFetching: true });
            try {
                let res = await getAllUsers(userInfo.id);
                if (res && res.errCode === 0 && res.users) {
                    let user = res.users;
                    let imageBase64 = '';

                    if (user.image) {
                        if (typeof user.image === 'string') {
                            imageBase64 = user.image.startsWith('data:image') ? user.image : `data:image/jpeg;base64,${user.image}`;
                        } else if (user.image.data && user.image.data.length) {
                            try {
                                let str = '';
                                const chunkSize = 0x8000;
                                const byteArray = user.image.data;
                                for (let i = 0; i < byteArray.length; i += chunkSize) {
                                    str += String.fromCharCode.apply(null, byteArray.slice(i, i + chunkSize));
                                }
                                imageBase64 = str.startsWith('data:image') ? str : `data:image/jpeg;base64,${str}`;
                            } catch (e) {
                                console.error('[PROFILE] Lỗi đọc dữ liệu ảnh:', e);
                            }
                        }
                    }

                    this.setState({
                        email: user.email || '',
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        phoneNumber: user.phoneNumber || '',
                        address: user.address || '',
                        gender: user.gender || 'M',
                        roleId: user.roleId || '',
                        positionId: user.positionId || '',
                        avatar: imageBase64,
                        previewImgURL: imageBase64
                    });
                }
            } catch (err) {
                console.error('Lỗi tải thông tin user:', err);
            } finally {
                this.setState({ isFetching: false });
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
        if (!userInfo || !userInfo.id || this.state.isSaving) return;

        this.setState({ isSaving: true });
        let isSuccess = false;

        try {
            let res = await editUserService({
                id: userInfo.id,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.roleId,
                positionId: this.state.positionId,
                avatar: this.state.avatar
            });

            if (res && res.errCode === 0) {
                isSuccess = true;
            } else {
                toast.error("Lỗi cập nhật: " + (res?.errMessage || "Không xác định"));
            }
        } catch (error) {
            console.error('Lỗi cập nhật user profile:', error);
            toast.error("Đã xảy ra lỗi khi kết nối máy chủ!");
        } finally {
            this.setState({ isSaving: false });
        }

        if (isSuccess) {
            toast.success("Cập nhật thông tin thành công!");
            try {
                if (this.props.userLoginSuccess) {
                    this.props.userLoginSuccess({
                        ...userInfo,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        address: this.state.address,
                        phoneNumber: this.state.phoneNumber,
                        gender: this.state.gender,
                        image: this.state.avatar
                    });
                }
            } catch (reduxErr) {
                console.error("Lỗi cập nhật Redux:", reduxErr);
            }
        }
    }

    handleSendReplyToDoctor = () => {
        let { patientReply, patientMessages } = this.state;
        if (!patientReply || !patientReply.trim()) return;

        let newMsg = {
            doctorId: 1,
            doctorName: 'BS. Seol-ah Yu',
            specialty: 'Chuyên khoa Thần kinh',
            time: 'Vừa xong',
            text: patientReply.trim(),
            sender: 'patient'
        };

        this.setState({
            patientMessages: [...patientMessages, newMsg],
            patientReply: ''
        });

        toast.success("Đã phản hồi tới Bác sĩ!");
    }

    render() {
        let { email, firstName, lastName, phoneNumber, address, gender, previewImgURL, isFetching, isSaving, activeTab, patientMessages, patientReply } = this.state;

        return (
            <div className="user-profile-container">
                <HomeHeader isShowBanner={false} />

                <div className="profile-body">
                    <CustomLoadingOverlay active={isSaving} text="Đang xử lý cập nhật...">
                        <div className="profile-card">
                            {/* TAB NAVIGATOR */}
                            <div className="profile-tab-header mb-4" style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
                                <button
                                    className="btn"
                                    style={{
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        backgroundColor: activeTab === 'PROFILE' ? '#2248bd' : '#f8fafc',
                                        color: activeTab === 'PROFILE' ? '#ffffff' : '#475569',
                                        border: activeTab === 'PROFILE' ? 'none' : '1px solid #cbd5e1',
                                        padding: '8px 18px'
                                    }}
                                    onClick={() => this.setState({ activeTab: 'PROFILE' })}
                                >
                                    <i className="fas fa-user mr-2"></i> Thông tin cá nhân
                                </button>

                                <button
                                    className="btn"
                                    style={{
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        backgroundColor: activeTab === 'INBOX' ? '#2248bd' : '#f8fafc',
                                        color: activeTab === 'INBOX' ? '#ffffff' : '#475569',
                                        border: activeTab === 'INBOX' ? 'none' : '1px solid #cbd5e1',
                                        padding: '8px 18px'
                                    }}
                                    onClick={() => this.setState({ activeTab: 'INBOX' })}
                                >
                                    <i className="fas fa-comments mr-2"></i> Hộp thư dặn dò từ Bác sĩ
                                </button>
                            </div>

                            {activeTab === 'PROFILE' ? (
                                <>
                                    <h2>Thông tin tài khoản</h2>

                                    {isFetching ? (
                                        <div className="profile-fetching-loader">
                                            <i className="fas fa-circle-notch fa-spin"></i>
                                            <span>Đang tải thông tin cá nhân...</span>
                                        </div>
                                    ) : (
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
                                                    disabled={isSaving}
                                                    onChange={(event) => this.handleOnChangeImage(event)}
                                                />
                                                <label htmlFor="previewImg" className={`btn-change-avatar ${isSaving ? 'disabled' : ''}`}>Thay đổi ảnh</label>
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
                                                            disabled={isSaving}
                                                            onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                                        />
                                                    </div>
                                                    <div className="col">
                                                        <label>Tên</label>
                                                        <input
                                                            type="text" value={lastName}
                                                            disabled={isSaving}
                                                            onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group row-group">
                                                    <div className="col">
                                                        <label>Số điện thoại</label>
                                                        <input
                                                            type="text" value={phoneNumber}
                                                            disabled={isSaving}
                                                            onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                                        />
                                                    </div>
                                                    <div className="col">
                                                        <label>Giới tính</label>
                                                        <select
                                                            className="form-control custom-select"
                                                            value={gender}
                                                            disabled={isSaving}
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
                                                        disabled={isSaving}
                                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                                    />
                                                </div>

                                                <button
                                                    className="btn-update"
                                                    disabled={isSaving}
                                                    onClick={() => this.handleSaveUser()}
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                                            Đang cập nhật...
                                                        </>
                                                    ) : (
                                                        'Cập nhật thông tin'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="patient-inbox-section">
                                    <h2 style={{ color: '#2248bd' }}>
                                        <i className="fas fa-envelope-open-text mr-2"></i>
                                        Hộp thư & Lời dặn từ Bác sĩ
                                    </h2>
                                    <div className="inbox-messages-container" style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        {this.state.isLoadingComments ? (
                                            <div className="text-center py-4 text-muted">
                                                <i className="fas fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu tin nhắn từ cơ sở dữ liệu...
                                            </div>
                                        ) : (patientMessages && patientMessages.length > 0 ? (
                                            patientMessages.map((msg, idx) => {
                                                let isDoctor = msg.authorName && msg.authorName.startsWith('BS.');
                                                return (
                                                    <div key={idx} className="doctor-msg-card mb-3" style={{ background: '#ffffff', borderLeft: isDoctor ? '4px solid #2248bd' : '4px solid #45c3d2', padding: '14px 18px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <strong style={{ color: isDoctor ? '#2248bd' : '#0284c7' }}>
                                                                {isDoctor ? <i className="fas fa-user-md mr-1"></i> : <i className="fas fa-user mr-1"></i>}
                                                                {msg.authorName || 'Người dùng'}
                                                            </strong>
                                                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                                                {msg.createdAt ? new Date(msg.createdAt).toLocaleString('vi-VN') : ''}
                                                            </span>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>{msg.content}</p>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-4 text-muted">Chưa có tin nhắn dặn dò nào trong cơ sở dữ liệu</div>
                                        ))}
                                        <div className="reply-box-row mt-4" style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Nhập câu hỏi hoặc phản hồi lại Bác sĩ..."
                                                value={patientReply}
                                                onChange={(e) => this.setState({ patientReply: e.target.value })}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') this.handleSendReplyToDoctor();
                                                }}
                                                style={{ borderRadius: '8px', fontSize: '14px' }}
                                            />
                                            <button
                                                className="btn"
                                                style={{ borderRadius: '8px', fontWeight: 'bold', padding: '0 24px', backgroundColor: '#2248bd', color: '#ffffff' }}
                                                onClick={this.handleSendReplyToDoctor}
                                            >
                                                <i className="fas fa-paper-plane mr-1"></i> Phản hồi
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CustomLoadingOverlay>
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