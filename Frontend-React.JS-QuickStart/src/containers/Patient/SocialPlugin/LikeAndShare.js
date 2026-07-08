import React, { Component } from 'react';
import { connect } from 'react-redux'; // 🛠️ 1. Import Redux để lấy thông tin User
import './SocialPlugin.scss';
import { toggleLikeDoctorApi, getLikesDoctorApi } from '../../../services/userService';
import { toast } from 'react-toastify'; // 🛠️ Import thêm Toast để báo lỗi

class LikeAndShare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLiked: false,
            likeCount: 0,
            shareCount: 15,
            isShowShareMenu: false
        }
        this.shareMenuRef = React.createRef();
    }

    async componentDidMount() {
        this.fetchLikeData();
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    async componentDidUpdate(prevProps) {
        // Cập nhật lại Like nếu chuyển Bác sĩ, hoặc khi User vừa đăng nhập/đăng xuất
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent || this.props.isLoggedIn !== prevProps.isLoggedIn) {
            this.fetchLikeData();
        }
    }

    handleClickOutside = (event) => {
        if (this.shareMenuRef && this.shareMenuRef.current && !this.shareMenuRef.current.contains(event.target)) {
            this.setState({ isShowShareMenu: false });
        }
    }

    fetchLikeData = async () => {
        let { doctorIdFromParent, isLoggedIn, userInfo } = this.props;

        // 🛠️ 2. LẤY ID CỦA NGƯỜI DÙNG THẬT
        let currentPatientId = (isLoggedIn && userInfo) ? userInfo.id : null;

        if (doctorIdFromParent) {
            let res = await getLikesDoctorApi(doctorIdFromParent, currentPatientId);
            if (res && res.errCode === 0 && res.data) {
                this.setState({
                    likeCount: res.data.totalLikes,
                    isLiked: res.data.isLiked
                });
            }
        }
    }

    handleToggleLike = async () => {
        let { doctorIdFromParent, isLoggedIn, userInfo } = this.props;
        let { isLiked, likeCount } = this.state;

        if (!doctorIdFromParent) return;

        // 🛠️ 3. NẾU CHƯA ĐĂNG NHẬP THÌ CHẶN LẠI VÀ CẢNH BÁO
        if (!isLoggedIn || !userInfo) {
            toast.warn("Vui lòng đăng nhập để Thích bác sĩ này!");
            return;
        }

        let currentPatientId = userInfo.id; // Lấy ID thật

        // OPTIMISTIC UPDATE - Cập nhật UI ngay lập tức cho mượt
        this.setState({
            isLiked: !isLiked,
            likeCount: isLiked ? likeCount - 1 : likeCount + 1
        });

        // Gọi API chạy ngầm phía sau với ID thật
        let res = await toggleLikeDoctorApi({
            doctorId: doctorIdFromParent,
            patientId: currentPatientId // 🛠️ Truyền ID thật xuống DB
        });

        if (res && res.errCode !== 0) {
            this.fetchLikeData();
        }
    }

    toggleShareMenu = () => {
        this.setState({ isShowShareMenu: !this.state.isShowShareMenu })
    }

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
        toast.success("Đã copy đường dẫn Bác sĩ vào bộ nhớ tạm!"); // Đổi sang Toast cho đẹp
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

// 🛠️ 4. MAP REDUX VÀO COMPONENT ĐỂ LẤY INFO USER
const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

export default connect(mapStateToProps)(LikeAndShare);