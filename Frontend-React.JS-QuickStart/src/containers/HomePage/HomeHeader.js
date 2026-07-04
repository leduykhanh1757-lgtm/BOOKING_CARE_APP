import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import './HomeHeader.scss';
import { languages } from '../../utils';
import { changeLanguageApp } from '../../store/actions/appActions';
import * as actions from '../../store/actions';
import { withRouter } from 'react-router';
import { getAllSpecialty } from '../../services/userService';

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSpecialty: [],
            searchQuery: '',
            searchResults: [],
            isShowResult: false
        };
        this.searchRef = React.createRef();
    }

    async componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);

        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                listSpecialty: res.data ? res.data : []
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.searchRef && this.searchRef.current && !this.searchRef.current.contains(event.target)) {
            this.setState({ isShowResult: false });
        }
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push('/home');
        }
    }

    handleSearchChange = (event) => {
        let query = event.target.value;
        let { listSpecialty } = this.state;

        if (query) {
            let filtered = listSpecialty.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase())
            );
            this.setState({
                searchQuery: query,
                searchResults: filtered,
                isShowResult: true
            });
        } else {
            this.setState({
                searchQuery: query,
                searchResults: [],
                isShowResult: false
            });
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    handleGoToSupport = () => {
        if (this.props.history) {
            this.props.history.push('/support');
        }
    }

    // HÀM ĐĂNG XUẤT TÀI KHOẢN
    handleLogout = () => {
        this.props.processLogout();
    }

    render() {
        // Lấy thêm isLoggedIn và userInfo từ Redux
        let { language, isLoggedIn, userInfo, intl } = this.props;
        let { searchQuery, searchResults, isShowResult } = this.state;

        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        {/* Phần 1: Bên trái */}
                        <div className='left-content'>
                            <i className="fas fa-bars"></i>
                            <div className="header-logo" onClick={() => this.returnToHome()}></div>
                        </div>

                        {/* Phần 2: Ở giữa */}
                        <div className='center-content'>
                            <div className="child-content">
                                <div><b><FormattedMessage id="home-header.speciality" /></b></div>
                                <div className="subs-title"><FormattedMessage id="home-header.searchdoctor" /></div>
                            </div>
                            <div className="child-content">
                                <div><b><FormattedMessage id="home-header.health-facility" /></b></div>
                                <div className="subs-title"><FormattedMessage id="home-header.select-room" /></div>
                            </div>
                            <div className="child-content">
                                <div><b><FormattedMessage id="home-header.doctor" /></b></div>
                                <div className="subs-title"><FormattedMessage id="home-header.select-doctor" /></div>
                            </div>
                            <div className="child-content">
                                <div><b><FormattedMessage id="home-header.fee" /></b></div>
                                <div className="subs-title"><FormattedMessage id="home-header.check-health" /></div>
                            </div>
                        </div>

                        {/* Phần 3: Bên phải */}
                        <div className='right-content'>
                            <div className="support" onClick={() => this.handleGoToSupport()}>
                                <i className="fas fa-question-circle"></i>
                                <span><FormattedMessage id="home-header.support" /></span>
                            </div>
                            <div className="language-vi">
                                <span
                                    className={language === languages.VI ? 'active' : ''}
                                    onClick={() => this.changeLanguage(languages.VI)}
                                >VN</span>
                            </div>
                            <div className="language-en">
                                <span
                                    className={language === languages.EN ? 'active' : ''}
                                    onClick={() => this.changeLanguage(languages.EN)}
                                >EN</span>
                            </div>

                            {/* KHU VỰC HIỂN THỊ TÀI KHOẢN KHÁCH HÀNG */}
                            <div className="user-login-section">
                                {isLoggedIn ? (
                                    <div className="user-profile">
                                        <div className="avatar"></div>
                                        <span className="welcome-text">Xin chào, {userInfo ? userInfo.firstName : ''}!</span>
                                        <span className="logout-btn" onClick={this.handleLogout} title="Đăng xuất">
                                            <i className="fas fa-sign-out-alt"></i>
                                        </span>
                                    </div>
                                ) : (
                                    <div className="login-btn" onClick={() => this.props.history.push('/user-login')}>
                                        Đăng nhập
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Phần Banner bên dưới giữ nguyên */}
                {this.props.isShowBanner === true && (
                    <div className='home-header-banner'>
                        <div className="content-up">
                            <div className="title1"><FormattedMessage id="banner.title1" /></div>
                            <div className="title2"><FormattedMessage id="banner.title2" /></div>

                            <div className="search" ref={this.searchRef}>
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder={intl.formatMessage({ id: 'banner.search' })}
                                    value={searchQuery}
                                    onChange={(event) => this.handleSearchChange(event)}
                                    onFocus={() => { if (searchQuery) this.setState({ isShowResult: true }) }}
                                />

                                {isShowResult && searchResults.length > 0 &&
                                    <div className="search-results">
                                        {searchResults.map((item, index) => {
                                            return (
                                                <div
                                                    className="result-item"
                                                    key={index}
                                                    onClick={() => this.handleViewDetailSpecialty(item)}
                                                >
                                                    {item.name}
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="content-down">
                            <div className="options">
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-hospital"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child1" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-mobile-alt"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child2" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-procedures"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child3" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-flask"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child4" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-user-md"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child5" /></div>
                                </div>
                                <div className="option-child">
                                    <div className="icon-child"><i className="fas fa-briefcase-medical"></i></div>
                                    <div className="text-child"><FormattedMessage id="banner.child6" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo, // Lấy thông tin user từ Redux
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
        processLogout: () => dispatch(actions.processLogout()) // Map hàm đăng xuất vào props
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeHeader)));