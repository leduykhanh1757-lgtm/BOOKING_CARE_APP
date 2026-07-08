import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader'; // Import thanh Header dùng chung
import { getDetailHandbookById } from '../../../services/userService';
import './DetailHandbook.scss';

class DetailHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDetailHandbook: {}, // Chứa dữ liệu bài viết
            isLoading: true,
        }
    }

    async componentDidMount() {
        // Lấy cái ID trên thanh URL (ví dụ: /detail-handbook/3 thì id = 3)
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            // Gọi API lấy full data
            let res = await getDetailHandbookById({ id: id });
            if (res && res.errCode === 0) {
                this.setState({
                    dataDetailHandbook: res.data,
                    isLoading: false,
                })
            } else {
                this.setState({ isLoading: false });
            }
        } else {
            this.setState({ isLoading: false });
        }
    }

    render() {
        let { dataDetailHandbook, isLoading } = this.state;

        return (
            <div className="detail-handbook-container">
                {/* Tái sử dụng thanh Header của trang chủ (ẩn cái Banner đi) */}
                <HomeHeader isShowBanner={false} />

                <div className="handbook-body">
                    {isLoading && (
                        <div className="loading-text">
                            <FormattedMessage id="detail-handbook.loading" defaultMessage="Đang tải dữ liệu..." />
                        </div>
                    )}

                    {!isLoading && (!dataDetailHandbook || !dataDetailHandbook.name) && (
                        <div className="empty-text">
                            <FormattedMessage id="detail-handbook.not-found" defaultMessage="Không tìm thấy bài viết." />
                        </div>
                    )}

                    {!isLoading && dataDetailHandbook && dataDetailHandbook.name && (
                        <>
                            {/* Tên bài viết -> dữ liệu động từ DB, để Google Translate tự dịch */}
                            <h2 className="handbook-title">
                                {dataDetailHandbook.name}
                            </h2>

                            {/* Dùng dangerouslySetInnerHTML để render HTML từ DB ra giao diện.
                                Lưu ý: cần đảm bảo backend đã sanitize nội dung này để tránh XSS */}
                            <div className="handbook-content">
                                {dataDetailHandbook.descriptionHTML &&
                                    <div dangerouslySetInnerHTML={{ __html: dataDetailHandbook.descriptionHTML }}></div>
                                }
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

export default DetailHandbook;