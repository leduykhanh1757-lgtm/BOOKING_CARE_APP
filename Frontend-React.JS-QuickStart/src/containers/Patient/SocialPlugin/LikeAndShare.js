import React, { Component } from 'react';
import './SocialPlugin.scss';
import { toggleLikeDoctorApi, getLikesDoctorApi } from '../../../services/userService';

class LikeAndShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: false,
            likeCount: 0,
            shareCount: 15,
            fakePatientId: 1,
            isShowShareMenu: false
        }
        // TỐI ƯU 2: Tạo ref để quản lý việc click ra ngoài vùng menu
        this.shareMenuRef = React.createRef();
    }

    async componentDidMount() {
        this.fetchLikeData();
        // Lắng nghe sự kiện click trên toàn bộ tài liệu
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        // Dọn dẹp sự kiện khi component bị hủy để tránh rò rỉ bộ nhớ
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    async componentDidUpdate(prevProps) {
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            this.fetchLikeData();
        }
    }

    // TỐI ƯU 2: Hàm tự động đóng Menu khi click ra ngoài
    handleClickOutside = (event) => {
        if (this.shareMenuRef && this.shareMenuRef.current && !this.shareMenuRef.current.contains(event.target)) {
            this.setState({ isShowShareMenu: false });
        }
    }

    fetchLikeData = async () => {
        let { doctorIdFromParent } = this.props;
        let { fakePatientId } = this.state;

        if (doctorIdFromParent) {
            let res = await getLikesDoctorApi(doctorIdFromParent, fakePatientId);
            if (res && res.errCode === 0 && res.data) {
                this.setState({
                    likeCount: res.data.totalLikes,
                    isLiked: res.data.isLiked
                });
            }
        }
    }

    handleToggleLike = async () => {
        let { doctorIdFromParent } = this.props;
        let { fakePatientId, isLiked, likeCount } = this.state;

        if (!doctorIdFromParent) return;

        // TỐI ƯU 1: OPTIMISTIC UPDATE - Cập nhật UI ngay lập tức cho mượt
        this.setState({
            isLiked: !isLiked,
            likeCount: isLiked ? likeCount - 1 : likeCount + 1
        });

        // Gọi API chạy ngầm phía sau
        let res = await toggleLikeDoctorApi({
            doctorId: doctorIdFromParent,
            patientId: fakePatientId
        });

        // Nếu lỡ xui API báo lỗi, tự động refetch lại data để đồng bộ với DB
        if (res && res.errCode !== 0) {
            this.fetchLikeData();
        }
    }

    toggleShareMenu = () => {
        this.setState({ isShowShareMenu: !this.state.isShowShareMenu })
    }

    // TỐI ƯU 3: Hàm tiện ích giúp ép Popup luôn nằm GIỮA màn hình
    openPopupCenter = (url, title, w, h) => {
        const left = (window.screen.width / 2) - (w / 2);
        const top = (window.screen.height / 2) - (h / 2);
        window.open(url, title, `width=${w},height=${h},top=${top},left=${left}`);
    }

    shareToFacebook = () => {
        let currentUrl = process.env.REACT_APP_IS_LOCALHOST === "1" ? "https://bookingcare.vn/" : window.location.href;
        this.openPopupCenter(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, 'facebook-share-dialog', 600, 400);
        this.setState({ isShowShareMenu: false, shareCount: this.state.shareCount + 1 });
    }

    shareToZalo = () => {
        let currentUrl = process.env.REACT_APP_IS_LOCALHOST === "1" ? "https://bookingcare.vn/" : window.location.href;
        this.openPopupCenter(`https://sp.zalo.me/plugins/share?url=${encodeURIComponent(currentUrl)}`, 'zalo-share-dialog', 600, 500);
        this.setState({ isShowShareMenu: false, shareCount: this.state.shareCount + 1 });
    }

    copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Đã copy đường dẫn Bác sĩ vào bộ nhớ tạm!");
        this.setState({ isShowShareMenu: false, shareCount: this.state.shareCount + 1 });
    }

    render() {
        let { isLiked, likeCount, shareCount, isShowShareMenu } = this.state;
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

                {/* Gắn Ref vào container này để theo dõi Click ra ngoài */}
                <div className="share-container" ref={this.shareMenuRef}>
                    <button className="btn-share" onClick={() => this.toggleShareMenu()}>
                        <i className="fas fa-share-alt"></i>
                        <span>Chia sẻ</span>
                        <span className="count">({shareCount})</span>
                    </button>

                    {isShowShareMenu &&
                        <div className="share-dropdown-menu">
                            <div className="share-item facebook" onClick={() => this.shareToFacebook()}>
                                <i className="fab fa-facebook-f"></i> Chia sẻ lên Facebook
                            </div>
                            <div className="share-item zalo" onClick={() => this.shareToZalo()}>
                                <i className="fas fa-comment-dots"></i> Chia sẻ qua Zalo
                            </div>
                            <div className="share-item copy" onClick={() => this.copyToClipboard()}>
                                <i className="fas fa-link"></i> Sao chép liên kết
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default LikeAndShare;