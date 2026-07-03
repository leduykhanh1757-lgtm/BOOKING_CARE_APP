import React, { Component } from 'react';
import './SocialPlugin.scss';
import { createNewCommentApi, getCommentsByIdApi } from '../../../services/userService'; // Import API
import moment from 'moment'; // Dùng moment để format ngày tháng

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: '',
            comments: [] // Mảng trống, lát lấy từ DB về
        }
    }

    async componentDidMount() {
        this.fetchComments();
    }

    async componentDidUpdate(prevProps) {
        // Khi chuyển sang trang bác sĩ khác, gọi lại API
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
        let { doctorIdFromParent } = this.props;

        if (!inputText.trim()) return;

        // Đẩy dữ liệu xuống DB
        let res = await createNewCommentApi({
            doctorId: doctorIdFromParent,
            authorName: "Khách viếng thăm",
            content: inputText
        });

        if (res && res.errCode === 0) {
            this.setState({ inputText: '' }); // Xóa ô input
            this.fetchComments(); // Gọi lại hàm load danh sách để cập nhật bình luận mới
        }
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleSendComment();
        }
    }

    render() {
        let { comments, inputText } = this.state;
        return (
            <div className="custom-comment-section">
                <div className="comment-header">
                    <h4>Bình luận ({comments.length})</h4>
                </div>

                <div className="comment-input-area">
                    <div className="avatar-placeholder">
                        <i className="fas fa-user-circle"></i>
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
                                    <i className="fas fa-user-circle"></i>
                                </div>
                                <div className="comment-content">
                                    <div className="author-name">{item.authorName}</div>
                                    <div className="text">{item.content}</div>
                                    {/* Format lại giờ giấc nhìn cho chuyên nghiệp */}
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

export default Comment;