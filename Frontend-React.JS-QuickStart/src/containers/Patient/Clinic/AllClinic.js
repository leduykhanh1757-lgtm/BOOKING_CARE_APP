import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import './AllClinic.scss';
import { getAllClinic } from '../../../services/userService';

class AllClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: [],
            isLoading: true,
        }
    }

    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data ? res.data : [],
                isLoading: false,
            });
        } else {
            this.setState({ isLoading: false });
        }
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`);
        }
    }

    render() {
        let { dataClinics, isLoading } = this.state;

        return (
            <div className="all-clinic-container">
                <HomeHeader isShowBanner={false} />
                <div className="all-clinic-body">
                    <div className="all-clinic-content">
                        {/* Chữ tĩnh -> dùng FormattedMessage để đổi ngôn ngữ qua i18n,
                            không phụ thuộc Google Translate */}
                        <div className="title-section">
                            <FormattedMessage id="all-clinic.title" defaultMessage="Cơ sở y tế nổi bật" />
                        </div>

                        <div className="list-clinic">
                            {isLoading && (
                                <div className="loading-text">
                                    <FormattedMessage id="all-clinic.loading" defaultMessage="Đang tải dữ liệu..." />
                                </div>
                            )}

                            {!isLoading && dataClinics.length === 0 && (
                                <div className="empty-text">
                                    <FormattedMessage id="all-clinic.empty" defaultMessage="Chưa có cơ sở y tế nào." />
                                </div>
                            )}

                            {!isLoading && dataClinics && dataClinics.length > 0 &&
                                dataClinics.map((item) => {
                                    return (
                                        <div
                                            className="clinic-item"
                                            key={item.id}
                                            onClick={() => this.handleViewDetailClinic(item)}
                                        >
                                            <div
                                                className="bg-image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
                                            {/* Tên cơ sở y tế -> dữ liệu động từ DB, để Google Translate tự dịch,
                                                KHÔNG bọc FormattedMessage vì nội dung này không có sẵn trong file ngôn ngữ */}
                                            <div className="clinic-name">{item.name}</div>
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

export default connect()(AllClinic);