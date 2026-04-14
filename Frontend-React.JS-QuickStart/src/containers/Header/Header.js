import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import { languages, USER_ROLE } from '../../utils/constant';
import _ from 'lodash'; // Import thư viện lodash để check object rỗng

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

            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            }

            if (role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
        }

        this.setState({
            menuApp: menu
        });
    }
    HandleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }
    render() {
        const { processLogout, language, userInfo } = this.props;

        return (
            <div className="header-container">
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
                        onClick={() => this.HandleChangeLanguage(languages.VI)}>VN</span>
                    <span className={language === languages.EN ? 'languages-en active' : 'languages-en'}
                        onClick={() => this.HandleChangeLanguage(languages.EN)}>EN</span>
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
