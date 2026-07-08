import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import './AllHandbook.scss';
import { getAllHandbook } from '../../../services/userService';

const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    const trimmed = text.slice(0, maxLength);
    const lastSpace = trimmed.lastIndexOf(' ');
    const safeText = lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed;
    return safeText.trim() + '...';
};

class AllHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHandbooks: [],
            isLoading: true,
        }
    }

    async componentDidMount() {
        let res = await getAllHandbook();
        if (res && res.errCode === 0) {
            this.setState({
                dataHandbooks: res.data ? res.data : [],
                isLoading: false,
            });
        } else {
            this.setState({ isLoading: false });
        }
    }

    handleViewDetailHandbook = (handbook) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${handbook.id}`);
        }
    }

    render() {
        let { dataHandbooks, isLoading } = this.state;

        return (
            <div className="all-handbook-container">
                <HomeHeader isShowBanner={false} />
                <div className="all-handbook-body">
                    <div className="all-handbook-content">
                        {/* Chữ tĩnh -> FormattedMessage */}
                        <div className="title-section">
                            <FormattedMessage id="all-handbook.title" defaultMessage="Cẩm nang y tế" />
                        </div>

                        <div className="list-handbook">
                            {isLoading && (
                                <div className="loading-text">
                                    <FormattedMessage id="all-handbook.loading" defaultMessage="Đang tải dữ liệu..." />
                                </div>
                            )}

                            {!isLoading && dataHandbooks.length === 0 && (
                                <div className="empty-text">
                                    <FormattedMessage id="all-handbook.empty" defaultMessage="Chưa có cẩm nang nào." />
                                </div>
                            )}

                            {!isLoading && dataHandbooks && dataHandbooks.length > 0 &&
                                dataHandbooks.map((item) => {
                                    return (
                                        <div
                                            className="handbook-item"
                                            key={item.id}
                                            onClick={() => this.handleViewDetailHandbook(item)}
                                        >
                                            <div
                                                className="bg-image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
                                            {/* Tên bài viết -> dữ liệu động từ DB, để Google Translate tự dịch */}
                                            <div className="handbook-name" title={item.name}>
                                                {truncateText(item.name, 50)}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(AllHandbook);