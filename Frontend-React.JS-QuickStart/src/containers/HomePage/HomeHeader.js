import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import './HomeHeader.scss';
import { languages } from '../../utils';
import { changeLanguageApp } from '../../store/actions/appActions';
import { withRouter } from 'react-router';
import { getAllSpecialty } from '../../services/userService'; //  Import API lấy chuyên khoa


class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSpecialty: [],     // Chứa toàn bộ dữ liệu chuyên khoa lấy từ DB
            searchQuery: '',       // Từ khóa người dùng gõ
            searchResults: [],     // Mảng kết quả sau khi lọc
            isShowResult: false    // Trạng thái ẩn/hiện bảng kết quả
        };
        this.searchRef = React.createRef(); // 🛠️ Ref để bắt sự kiện click ra ngoài
    }

    async componentDidMount() {
        // Lắng nghe sự kiện click ra ngoài
        document.addEventListener("mousedown", this.handleClickOutside);

        // Gọi API lấy toàn bộ danh sách chuyên khoa 1 lần duy nhất
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                listSpecialty: res.data ? res.data : []
            });
        }
    }

    componentWillUnmount() {
        // Dọn dẹp sự kiện
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    // 🛠️ Hàm đóng menu kết quả khi bấm ra ngoài vùng tìm kiếm
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

    // 🛠️ HÀM XỬ LÝ LỌC KẾT QUẢ KHI GÕ PHÍM
    handleSearchChange = (event) => {
        let query = event.target.value;
        let { listSpecialty } = this.state;

        if (query) {
            // Lọc các chuyên khoa có tên chứa từ khóa gõ vào (không phân biệt hoa thường)
            let filtered = listSpecialty.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase())
            );
            this.setState({
                searchQuery: query,
                searchResults: filtered,
                isShowResult: true
            });
        } else {
            // Nếu xóa trắng ô input thì ẩn bảng kết quả
            this.setState({
                searchQuery: query,
                searchResults: [],
                isShowResult: false
            });
        }
    }

    // 🛠️ HÀM CHUYỂN TRANG KHI CLICK VÀO KẾT QUẢ
    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        let language = this.props.language;
        let { searchQuery, searchResults, isShowResult } = this.state;
        let { intl } = this.props;
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

                        {/* Phần 3: Bên right */}
                        <div className='right-content'>
                            <div className="support">
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
                        </div>
                    </div>
                </div>

                {this.props.isShowBanner === true && (
                    <div className='home-header-banner'>
                        <div className="content-up">
                            <div className="title1"><FormattedMessage id="banner.title1" /></div>
                            <div className="title2"><FormattedMessage id="banner.title2" /></div>

                            {/* 🛠️ GẮN REF VÀ LOGIC TÌM KIẾM VÀO ĐÂY */}
                            <div className="search" ref={this.searchRef}>
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder={intl.formatMessage({ id: 'banner.search' })}
                                    value={searchQuery}
                                    onChange={(event) => this.handleSearchChange(event)}
                                    // Khi bấm vào ô input nếu có text thì mở lại popup
                                    onFocus={() => { if (searchQuery) this.setState({ isShowResult: true }) }}
                                />

                                {/* KẾT QUẢ TÌM KIẾM DROPDOWN */}
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
                            {/* ... (Các options bên dưới giữ nguyên) ... */}
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
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeHeader)));