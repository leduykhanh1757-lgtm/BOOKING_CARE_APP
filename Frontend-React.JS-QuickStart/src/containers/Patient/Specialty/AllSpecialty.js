import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import './AllSpecialty.scss';
import { getAllSpecialty } from '../../../services/userService';

class AllSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: [],
            isLoading: true,
        }
    }

    async componentDidMount() {
        // Tận dụng API đã có để lấy toàn bộ danh sách
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : [],
                isLoading: false,
            });
        } else {
            this.setState({ isLoading: false });
        }
    }

    // Hàm chuyển sang trang chi tiết khi click vào 1 ô
    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        let { dataSpecialty, isLoading } = this.state;

        return (
            <div className="all-specialty-container">
                {/* Gọi lại Header nhưng ẩn cái Banner to đùng đi */}
                <HomeHeader isShowBanner={false} />

                <div className="all-specialty-body">
                    <div className="all-specialty-content">
                        {/* Chữ tĩnh -> FormattedMessage */}
                        <div className="title-section">
                            <FormattedMessage id="all-specialty.title" defaultMessage="Khám chuyên khoa" />
                        </div>

                        <div className="list-specialty">
                            {isLoading && (
                                <div className="loading-text">
                                    <FormattedMessage id="all-specialty.loading" defaultMessage="Đang tải dữ liệu..." />
                                </div>
                            )}

                            {!isLoading && dataSpecialty.length === 0 && (
                                <div className="empty-text">
                                    <FormattedMessage id="all-specialty.empty" defaultMessage="Chưa có chuyên khoa nào." />
                                </div>
                            )}

                            {!isLoading && dataSpecialty && dataSpecialty.length > 0 &&
                                dataSpecialty.map((item) => {
                                    return (
                                        <div
                                            className="specialty-item"
                                            key={item.id}
                                            onClick={() => this.handleViewDetailSpecialty(item)}
                                        >
                                            <div
                                                className="bg-image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
                                            {/* Tên chuyên khoa -> dữ liệu động từ DB, để Google Translate tự dịch */}
                                            <div className="specialty-name">{item.name}</div>
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

export default connect()(AllSpecialty);