import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import './HomeHeader.scss';
import { languages } from '../../utils';
import { changeLanguageApp } from '../../store/actions/appActions';
import * as actions from '../../store/actions';
import { withRouter } from 'react-router';
import { getAllSpecialty, getAllUsers } from '../../services/userService';

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSpecialty: [],
            searchQuery: '',
            searchResults: [],
            isShowResult: false,
            isOpenDrawer: false,
            isShowProfileInfo: false,
            userImage: '' // Ảnh fetch trực tiếp từ DB, giống hệt cách UserProfile.js đang làm
        };
        this.searchRef = React.createRef();
        this.profileRef = React.createRef();
    }

    async componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({ listSpecialty: res.data || [] });
        }
        await this.fetchUserImageFromBackend();
    }

    async componentDidUpdate(prevProps) {
        // Redux userInfo lúc đăng nhập thường KHÔNG có field image đầy đủ.
        // Nên mỗi khi userInfo (id) thay đổi (đăng nhập/đăng xuất), tự fetch lại
        // trực tiếp từ DB — giống hệt cách UserProfile.js đang làm — thay vì
        // trông chờ vào Redux có sẵn ảnh.
        if (prevProps.userInfo?.id !== this.props.userInfo?.id) {
            await this.fetchUserImageFromBackend();
        }
    }

    fetchUserImageFromBackend = async () => {
        let { userInfo, isLoggedIn } = this.props;
        if (isLoggedIn && userInfo && userInfo.id) {
            let res = await getAllUsers(userInfo.id);
            if (res && res.errCode === 0 && res.users) {
                this.setState({ userImage: res.users.image || '' });
            }
        } else {
            this.setState({ userImage: '' });
        }
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.searchRef.current && !this.searchRef.current.contains(event.target)) {
            this.setState({ isShowResult: false });
        }
        if (this.profileRef.current && !this.profileRef.current.contains(event.target)) {
            this.setState({ isShowProfileInfo: false });
        }
    }

    handleAvatarClick = () => {
        if (!this.state.isShowProfileInfo) {
            this.setState({ isShowProfileInfo: true });
        } else {
            this.setState({ isShowProfileInfo: false });
            if (this.props.history) {
                this.props.history.push('/user/profile');
            }
        }
    }

    changeLanguage = (language) => {
        // 1. Gọi Redux để đổi các từ tĩnh
        this.props.changeLanguageAppRedux(language);

        // 2. Ép Google Translate dịch Dữ liệu động
        if (language === 'en') {
            document.cookie = "googtrans=/vi/en; path=/; domain=" + window.location.hostname;
        } else {
            document.cookie = "googtrans=/vi/vi; path=/; domain=" + window.location.hostname;
            document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }

        // 3. Tải lại trang
        window.location.reload();
    }

    toggleDrawer = () => this.setState({ isOpenDrawer: !this.state.isOpenDrawer });
    handleMenuClick = (path) => {
        this.toggleDrawer();
        if (path && this.props.history) this.props.history.push(path);
    }

    handleSearchChange = (event) => {
        let query = event.target.value;
        let filtered = query ? this.state.listSpecialty.filter(item => item.name.toLowerCase().includes(query.toLowerCase())) : [];
        this.setState({ searchQuery: query, searchResults: filtered, isShowResult: !!query });
    }

    // --- CÁC HÀM ĐIỀU HƯỚNG CHÍNH ---
    returnToHome = () => this.props.history && this.props.history.push('/home');
    handleViewDetailSpecialty = (item) => this.props.history && this.props.history.push(`/detail-specialty/${item.id}`);
    handleGoToSupport = () => this.props.history && this.props.history.push('/support');

    handleViewAllSpecialty = () => this.props.history && this.props.history.push('/all-specialty');
    handleViewAllClinic = () => this.props.history && this.props.history.push('/all-clinic');
    handleViewAllDoctor = () => this.props.history && this.props.history.push('/all-doctors');
    handleViewAllPackage = () => this.props.history && this.props.history.push('/all-package');
    handleViewVaccination = () => { if (this.props.history) this.props.history.push('/service/vaccination'); }
    handleViewRemote = () => { if (this.props.history) this.props.history.push('/service/remote-examination'); }
    handleViewPhysiotherapy = () => { if (this.props.history) this.props.history.push('/service/physiotherapy'); }
    handleViewMedicalTest = () => { if (this.props.history) this.props.history.push('/service/medical-test'); }
    handleViewMentalHealth = () => { if (this.props.history) this.props.history.push('/service/mental-health'); }
    handleViewDental = () => { if (this.props.history) this.props.history.push('/service/dental-examination'); }

    render() {
        let { language, isLoggedIn, userInfo, intl, changeLanguageAppRedux, processLogout, isShowBanner } = this.props;
        let { searchQuery, searchResults, isShowResult, isOpenDrawer, isShowProfileInfo, userImage } = this.state;

        // FIX ĐÚNG BẢN CHẤT: Buffer object { type:'Buffer', data:[...] } trong DB
        // thực ra là byte ASCII của MỘT CHUỖI BASE64 (đã có sẵn tiền tố data:image/...)
        // bị lưu nhầm dạng BLOB — KHÔNG phải byte ảnh nhị phân gốc.
        // => Chỉ cần đổi byte -> lại thành text (String.fromCharCode), TUYỆT ĐỐI
        // không được btoa() thêm lần nữa (sẽ ra base64-chồng-base64, ảnh hỏng).
        const bufferDataToString = (byteArray) => {
            try {
                let str = '';
                const chunkSize = 0x8000; // xử lý từng đoạn, tránh vỡ stack với ảnh lớn
                for (let i = 0; i < byteArray.length; i += chunkSize) {
                    str += String.fromCharCode.apply(null, byteArray.slice(i, i + chunkSize));
                }
                return str;
            } catch (e) {
                console.error('[HEADER] Lỗi đọc dữ liệu ảnh:', e);
                return '';
            }
        };

        let imageBase64 = '';
        let rawImage = userImage || (userInfo && userInfo.image) || '';
        if (rawImage) {
            if (typeof rawImage === 'string') {
                imageBase64 = rawImage.startsWith('data:image') ? rawImage : `data:image/jpeg;base64,${rawImage}`;
            } else if (rawImage.data && rawImage.data.length) {
                let decodedStr = bufferDataToString(rawImage.data);
                imageBase64 = decodedStr.startsWith('data:image') ? decodedStr : `data:image/jpeg;base64,${decodedStr}`;
            }
        }

        // TỐI ƯU 1: Cấu hình mảng dữ liệu cho Header Menu
        const headerMenus = [
            { titleId: "home-header.speciality", subId: "home-header.searchdoctor", onClick: this.handleViewAllSpecialty },
            { titleId: "home-header.health-facility", subId: "home-header.select-room", onClick: this.handleViewAllClinic },
            { titleId: "home-header.doctor", subId: "home-header.select-doctor", onClick: this.handleViewAllDoctor },
            { titleId: "home-header.fee", subId: "home-header.check-health", onClick: this.handleViewAllPackage },
        ];

        // TỐI ƯU 2: Cấu hình mảng dữ liệu cho 6 Bong bóng Banner
        const bannerOptions = [
            { titleVi: "Tiêm chủng y tế", titleEn: "Vaccination", icon: "fas fa-syringe", onClick: this.handleViewVaccination },
            { id: "banner.child2", icon: "fas fa-mobile-alt", onClick: this.handleViewRemote },
            { titleVi: "Vật lý trị liệu", titleEn: "Physiotherapy", icon: "fas fa-wheelchair", onClick: this.handleViewPhysiotherapy },
            { id: "banner.child4", icon: "fas fa-flask", onClick: this.handleViewMedicalTest },
            { id: "banner.child5", icon: "fas fa-user-md", onClick: this.handleViewMentalHealth },
            { id: "banner.child6", icon: "fas fa-briefcase-medical", onClick: this.handleViewDental },
        ];

        return (
            <React.Fragment>
                {/* --- MENU TRƯỢT --- */}
                {isOpenDrawer && <div className="menu-backdrop" onClick={this.toggleDrawer}></div>}
                <div className={isOpenDrawer ? "side-drawer show" : "side-drawer"}>
                    <div className="menu-list">
                        <div className="menu-item" onClick={() => this.handleMenuClick('/home')}>Trang chủ</div>
                        <div className="menu-item" onClick={() => this.handleMenuClick('/all-handbook')}>Cẩm nang</div>
                        <div className="menu-item" onClick={() => this.handleMenuClick('/cooperation')}>Liên hệ hợp tác</div>
                        <div className="menu-item" onClick={() => this.handleMenuClick('/corporate-health')}>Sức khỏe doanh nghiệp</div>
                        <div className="menu-item" onClick={() => this.handleMenuClick('/digital-transformation')}>Chuyển đổi số Phòng khám</div>
                        <div className="menu-item" onClick={() => this.handleMenuClick('/recruitment')}>Tuyển dụng</div>
                        <div className="menu-group-title">VỀ BOOKINGCARE</div>
                        <div className="menu-item" onClick={() => this.handleMenuClick('/for-patients')}>Dành cho bệnh nhân</div>
                        <div className="menu-item" onClick={() => this.handleMenuClick('/for-doctors')}>Dành cho bác sĩ</div>
                        <div className="menu-item" onClick={() => this.handleMenuClick('/role')}>Vai trò của BookingCare</div>
                        <div className="menu-item" onClick={() => this.handleMenuClick('/contact')}>Liên hệ</div>
                        <div className="menu-item" onClick={() => this.handleMenuClick('/support')}>Câu hỏi thường gặp</div>
                        <div className="menu-item" onClick={() => this.handleMenuClick('/terms')}>Điều khoản sử dụng</div>
                        <div className="menu-item" onClick={() => this.handleMenuClick('/regulations')}>Quy chế hoạt động</div>
                    </div>
                </div>

                {/* --- THANH HEADER --- */}
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        {/* 1. Trái: Logo */}
                        <div className='left-content'>
                            <i className="fas fa-bars" onClick={this.toggleDrawer}></i>
                            <div className="header-logo" onClick={this.returnToHome}></div>
                        </div>

                        {/* 2. Giữa: Render từ mảng bằng map() */}
                        <div className='center-content'>
                            {headerMenus.map((menu, index) => (
                                <div className="child-content notranslate" key={index} onClick={menu.onClick}>
                                    <div className="main-title"><FormattedMessage id={menu.titleId} /></div>
                                    <div className="subs-title"><FormattedMessage id={menu.subId} /></div>
                                </div>
                            ))}
                        </div>

                        {/* 3. Phải: Tiện ích & Tài khoản */}
                        <div className='right-content'>
                            <div className="support notranslate" onClick={this.handleGoToSupport}>
                                <i className="fas fa-question-circle"></i>
                                <span><FormattedMessage id="home-header.support" /></span>
                            </div>
                            <div className="lang-group notranslate">
                                <span className={language === languages.VI ? 'active' : ''} onClick={() => this.changeLanguage(languages.VI)}>VN</span>
                                <span className="separator">/</span>
                                <span className={language === languages.EN ? 'active' : ''} onClick={() => this.changeLanguage(languages.EN)}>EN</span>
                            </div>

                            <div className="user-login-section" ref={this.profileRef}>
                                {isLoggedIn ? (
                                    <div className="user-profile">
                                        <div
                                            className="avatar"
                                            onClick={this.handleAvatarClick}
                                            title={language === languages.VI ? "Quản lý tài khoản" : "Manage Account"}
                                            style={{ backgroundImage: imageBase64 ? `url(${imageBase64})` : '' }}
                                        ></div>

                                        {isShowProfileInfo && (
                                            <div className="profile-info-popup">
                                                <div className="popup-header">
                                                    <div
                                                        className="popup-avatar"
                                                        style={{ backgroundImage: imageBase64 ? `url(${imageBase64})` : '' }}
                                                    ></div>
                                                    <div className="popup-details">
                                                        <div className="p-name">
                                                            {userInfo ? `${userInfo.firstName} ${userInfo.lastName || ''}` : (language === languages.VI ? 'Người dùng' : 'User')}
                                                        </div>
                                                        <div className="p-email">{userInfo?.email || ''}</div>
                                                    </div>
                                                </div>
                                                <div className="popup-actions">
                                                    <button className="btn-manage" onClick={this.handleAvatarClick}>
                                                        <i className="fas fa-tasks"></i>
                                                        {language === languages.VI ? 'Quản lý hệ thống' : 'System Management'}
                                                    </button>
                                                    <button className="btn-logout" onClick={() => {
                                                        processLogout();
                                                        this.props.history.push('/home');
                                                    }}>
                                                        <i className="fas fa-sign-out-alt"></i>
                                                        {language === languages.VI ? 'Đăng xuất' : 'Logout'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button className="login-btn" onClick={() => this.props.history.push('/user-login')}>
                                        {language === languages.VI ? 'Đăng nhập' : 'Login'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BANNER TÌM KIẾM --- */}
                {isShowBanner && (
                    <div className='home-header-banner'>
                        <div className="content-up">
                            <h1 className="title1 notranslate"><FormattedMessage id="banner.title1" /></h1>
                            <h2 className="title2 notranslate"><FormattedMessage id="banner.title2" /></h2>
                            <div className="search" ref={this.searchRef}>
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder={intl.formatMessage({ id: 'banner.search' })}
                                    value={searchQuery}
                                    onChange={this.handleSearchChange}
                                    onFocus={() => { if (searchQuery) this.setState({ isShowResult: true }) }}
                                />
                                {isShowResult && searchResults.length > 0 && (
                                    <div className="search-results">
                                        {searchResults.map((item, index) => (
                                            <div className="result-item" key={index} onClick={() => this.handleViewDetailSpecialty(item)}>
                                                {item.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="content-down">
                            <div className="options">
                                {/* Render 6 bong bóng từ mảng bằng map() */}
                                {bannerOptions.map((opt, index) => (
                                    <div className="option-child" key={index} onClick={opt.onClick}>
                                        <div className="icon-child"><i className={opt.icon}></i></div>
                                        <div className="text-child notranslate">
                                            {/* Tự động nhận diện ngôn ngữ */}
                                            {opt.id ? <FormattedMessage id={opt.id} /> : (language === languages.VI ? opt.titleVi : opt.titleEn)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
});

const mapDispatchToProps = dispatch => ({
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
    processLogout: () => dispatch(actions.processLogout())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeHeader)));