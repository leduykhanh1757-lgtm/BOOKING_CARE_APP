import React, { Component } from 'react';
import { connect } from 'react-redux'; // 🛠️ 1. Import connect từ react-redux
import './SocialPlugin.scss';
import { createNewCommentApi, getCommentsByIdApi } from '../../../services/userService';
import moment from 'moment';

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            comments: []
        }
    }

    async componentDidMount() {
        this.fetchComments();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            this.fetchComments();
        }
    }

    fetchComments = async () => {
        let { doctorIdFromParent } = this.props;
        if (doctorIdFromParent) {
            let res = await getCommentsByIdApi(doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({ comments: res.data });
            }
        }
    }

    handleOnChangeInput = (event) => {
        this.setState({ inputText: event.target.value });
    }

    handleSendComment = async () => {
        let { inputText } = this.state;
        let { doctorIdFromParent, isLoggedIn, userInfo } = this.props;

        if (!inputText.trim()) return;

        // 🛠️ 2. XỬ LÝ ĐỊNH DANH NGƯỜI DÙNG
        let authorName = "Khách viếng thăm";
        let authorAvatar = ""; // Chuỗi Base64 ảnh đại diện

        // Nếu đã đăng nhập, lấy Tên và Ảnh từ Redux ra
        if (isLoggedIn && userInfo) {
            let fullName = `${userInfo.firstName ? userInfo.firstName : ''} ${userInfo.lastName ? userInfo.lastName : ''}`.trim();
            authorName = fullName ? fullName : "Người dùng BookingCare";

            if (userInfo.image) {
                if (typeof userInfo.image === 'string' && userInfo.image.startsWith('data:image')) {
                    authorAvatar = userInfo.image;
                } else {
                    authorAvatar = new Buffer(userInfo.image, 'base64').toString('binary');
                }
            }
        }

        // Đẩy dữ liệu xuống DB
        let res = await createNewCommentApi({
            doctorId: doctorIdFromParent,
            authorName: authorName,
            authorAvatar: authorAvatar, // 🛠️ Truyền thêm Ảnh xuống Backend
            content: inputText
        });

        if (res && res.errCode === 0) {
            this.setState({ inputText: '' });
            this.fetchComments();
        }
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleSendComment();
        }
    }

    render() {
        let { comments, inputText } = this.state;
        let { isLoggedIn, userInfo } = this.props;
        console.log('DEBUG userInfo.image:', userInfo && userInfo.image);

        // 🛠️ 3. LẤY ẢNH NGƯỜI ĐANG ĐĂNG NHẬP ĐỂ HIỂN THỊ Ở Ô INPUT
        let currentUserAvatar = '';
        if (isLoggedIn && userInfo && userInfo.image) {
            if (typeof userInfo.image === 'string' && userInfo.image.startsWith('data:image')) {
                currentUserAvatar = userInfo.image;
            } else if (userInfo.image.data) {
                // Đề phòng trường hợp API trả về một object mảng nhị phân
                currentUserAvatar = Buffer.from(userInfo.image.data, 'base64').toString('binary');
            } else {
                // Xử lý base64 chuẩn
                currentUserAvatar = Buffer.from(userInfo.image, 'base64').toString('binary');
            }
        }

        return (
            <div className="custom-comment-section">
                <div className="comment-header">
                    <h4>Bình luận ({comments.length})</h4>
                </div>

                <div className="comment-input-area">
                    <div className="avatar-placeholder">
                        {/* Hiện ảnh nếu có, không có thì hiện icon mặc định */}
                        {currentUserAvatar ?
                            <div className="avatar-img" style={{ backgroundImage: `url(${currentUserAvatar})` }}></div>
                            : <i className="fas fa-user-circle"></i>
                        }
                    </div>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Viết bình luận của bạn..."
                            value={inputText}
                            onChange={(event) => this.handleOnChangeInput(event)}
                            onKeyDown={(event) => this.handleKeyDown(event)}
                        />
                        <button onClick={() => this.handleSendComment()}>Gửi</button>
                    </div>
                </div>

                <div className="comment-list">
                    {comments && comments.length > 0 && comments.map((item, index) => {
                        return (
                            <div className="comment-item" key={index}>
                                <div className="avatar-placeholder">
                                    {/* Hiển thị ảnh của người comment (Nếu API trả về có ảnh) */}
                                    {item.authorAvatar ?
                                        <div className="avatar-img" style={{ backgroundImage: `url(${item.authorAvatar})` }}></div>
                                        : <i className="fas fa-user-circle"></i>
                                    }
                                </div>
                                <div className="comment-content">
                                    <div className="author-name">{item.authorName}</div>
                                    <div className="text">{item.content}</div>
                                    <div className="time">{moment(item.createdAt).format('HH:mm - DD/MM/YYYY')}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}

// 🛠️ 4. MAP REDUX VÀO COMPONENT
const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

export default connect(mapStateToProps)(Comment);