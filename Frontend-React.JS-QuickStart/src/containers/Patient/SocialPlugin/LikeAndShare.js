import React, { Component } from 'react';
import './SocialPlugin.scss'; // 🛠️ Lát mình tạo file CSS này sau

class LikeAndShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: false,
            likeCount: 124, // Số like mồi (fake)
            shareCount: 15
        }
    }

    handleToggleLike = () => {
        let { isLiked, likeCount } = this.state;
        this.setState({
            isLiked: !isLiked,
            likeCount: isLiked ? likeCount - 1 : likeCount + 1
        });
    }

    handleShare = () => {
        let { shareCount } = this.state;
        this.setState({ shareCount: shareCount + 1 });
        // Tích hợp copy link hiện tại vào Clipboard
        navigator.clipboard.writeText(window.location.href);
        alert("Đã copy đường dẫn Bác sĩ để chia sẻ!");
    }

    render() {
        let { isLiked, likeCount, shareCount } = this.state;
        return (
            <div className="custom-like-share">
                <button
                    className={isLiked ? "btn-like active" : "btn-like"}
                    onClick={() => this.handleToggleLike()}
                >
                    <i className={isLiked ? "fas fa-thumbs-up" : "far fa-thumbs-up"}></i>
                    <span>{isLiked ? 'Đã thích' : 'Thích'}</span>
                    <span className="count">({likeCount})</span>
                </button>

                <button className="btn-share" onClick={() => this.handleShare()}>
                    <i className="fas fa-share-alt"></i>
                    <span>Chia sẻ</span>
                    <span className="count">({shareCount})</span>
                </button>
            </div>
        );
    }
}

export default LikeAndShare;