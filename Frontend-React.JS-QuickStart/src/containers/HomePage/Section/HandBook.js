import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { getAllHandbook } from '../../../services/userService';
import { withRouter } from 'react-router';
import './HandBook.scss';
import { FormattedMessage } from 'react-intl';

const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    const trimmed = text.slice(0, maxLength);
    const lastSpace = trimmed.lastIndexOf(' ');
    const safeText = lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed;

    return safeText.trim() + '...';
};

class Handbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHandbooks: []
        }
    }

    async componentDidMount() {
        let res = await getAllHandbook();
        if (res && res.errCode === 0) {
            this.setState({
                dataHandbooks: res.data ? res.data : []
            })
        }
    }

    handleViewDetailHandbook = (handbook) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${handbook.id}`);
        }
    }

    handleViewMoreHandbook = () => {
        if (this.props.history) {
            this.props.history.push(`/all-handbook`);
        }
    }

    render() {
        let { dataHandbooks } = this.state;

        return (
            <div className="section-share section-handbook">
                <div className="section-container">

                    {/* BỌC NOTRANSLATE CHO HEADER VÌ ĐÃ DÙNG FORMATTED_MESSAGE */}
                    <div className="section-header notranslate">
                        <h3><FormattedMessage id="homepage.handbook" /></h3>
                        <button onClick={() => this.handleViewMoreHandbook()}>
                            <FormattedMessage id="homepage.all-articles" />
                        </button>
                    </div>

                    <div className="section-body">
                        {dataHandbooks && dataHandbooks.length > 0 &&
                            <Slider {...this.props.settings}>
                                {dataHandbooks.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => this.handleViewDetailHandbook(item)}
                                        >
                                            <div className="handbook-customize">
                                                <div
                                                    className="bg-image"
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                ></div>

                                                {/* UYỆT ĐỐI KHÔNG NOTRANSLATE Ở ĐÂY để bài viết từ DB được Google dịch */}
                                                <h3
                                                    className="handbook-title"
                                                    title={item.name}
                                                >
                                                    <span>{truncateText(item.name, 60)}</span>
                                                </h3>
                                            </div>
                                        </div>
                                    )
                                })}
                            </Slider>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => { return { isLoggedIn: state.user.isLoggedIn }; };
const mapDispatchToProps = dispatch => { return {}; };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Handbook));