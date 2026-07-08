import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import { languages, USER_ROLE } from '../../utils/constant';
import _ from 'lodash';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menuApp: []
        };
    }

    componentDidMount() {
        let { userInfo } = this.props;
        let menu = [];

        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleId;

            // TỐI ƯU NHẸ: Dùng else if thay vì if rời rạc cho chuẩn logic phân nhánh
            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            } else if (role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
        }

        this.setState({
            menuApp: menu
        });
    }

    // =====================================================================
    // TỐI ƯU 1: CẬP NHẬT LOGIC ĐA NGÔN NGỮ (GIỐNG TRANG CHỦ)
    // Sửa tên hàm thành chữ thường ở đầu (handleChangeLanguage) cho đúng chuẩn naming convention.
    // Thêm thao tác Cookie để ép Google Translate hoạt động ngay trong trang Admin.
    // =====================================================================
    handleChangeLanguage = (language) => {
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

    render() {
        const { processLogout, language, userInfo } = this.props;

        return (
            // =====================================================================
            // CHỐT HẠ ĐA NGÔN NGỮ (i18n):
            // Gắn class "notranslate" vào khối bọc ngoài cùng (header-container).
            // Nhờ vậy, toàn bộ chữ trên thanh Menu đen và phần Welcome đều được bảo vệ
            // khỏi Google Translate, giữ nguyên bản dịch tay react-intl cực chuẩn của bác!
            // =====================================================================
            <div className="header-container notranslate">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>

                <div className='languages'>
                    <span className='welcome'>
                        <FormattedMessage id="home-header.welcome" />
                        {userInfo && userInfo.firstName ? userInfo.firstName : ' '}
                        ! </span>
                    <span className={language === languages.VI ? 'languages-vi active' : 'languages-vi'}
                        onClick={() => this.handleChangeLanguage(languages.VI)}>VN</span>
                    <span className={language === languages.EN ? 'languages-en active' : 'languages-en'}
                        onClick={() => this.handleChangeLanguage(languages.EN)}>EN</span>
                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout} title='Log out'>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (languages) => dispatch(actions.changeLanguageApp(languages))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);