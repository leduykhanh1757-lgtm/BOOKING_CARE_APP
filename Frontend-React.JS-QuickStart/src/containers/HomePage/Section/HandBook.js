import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { getAllHandbook } from '../../../services/userService'; // 🛠️ Import API
import { withRouter } from 'react-router'; // 🛠️ Import để lát bấm vào bài viết thì chuyển trang
import './HandBook.scss';
import { FormattedMessage } from 'react-intl';

// 🛠️ Cắt chữ theo TỪ (không cắt đứt giữa chữ), thêm "..." nếu vượt quá độ dài cho phép
// Dùng thay cho -webkit-line-clamp vì property này hay bị build tool (autoprefixer/cssnano)
// loại bỏ khi build production, gây lỗi tràn chữ ra ngoài card.
const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    const trimmed = text.slice(0, maxLength);
    // Cắt lùi về khoảng trắng gần nhất để không đứt giữa từ
    const lastSpace = trimmed.lastIndexOf(' ');
    const safeText = lastSpace > 0 ? trimmed.slice(0, lastSpace) : trimmed;

    return safeText.trim() + '...';
};

class Handbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHandbooks: [] // Khởi tạo state chứa mảng cẩm nang rỗng
        }
    }

    async componentDidMount() {
        // Gọi API lấy toàn bộ danh sách Cẩm nang từ Database
        let res = await getAllHandbook();
        if (res && res.errCode === 0) {
            this.setState({
                dataHandbooks: res.data ? res.data : []
            })
        }
    }

    handleViewDetailHandbook = (handbook) => {
        if (this.props.history) {
            // Chuyển hướng sang trang chi tiết (Tương tự Chuyên khoa/Phòng khám)
            this.props.history.push(`/detail-handbook/${handbook.id}`);
        }
    }

    render() {
        let { dataHandbooks } = this.state;

        return (
            <div className="section-share section-handbook">
                <div className="section-container">
                    <div className="section-header">
                        <h3><FormattedMessage id="homepage.handbook" /></h3>
                        <button><FormattedMessage id="homepage.all-articles" /></button>
                    </div>
                    <div className="section-body">
                        {/* Kiểm tra nếu có data thì mới render Slider để không bị lỗi trắng trang */}
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

                                                {/* 🛠️ Chú ý: Dưới DB mình đặt là 'name' nên lấy ra phải là item.name */}
                                                {/* 🛠️ Cắt chữ bằng JS (truncateText) thay vì dựa vào -webkit-line-clamp */}
                                                <h3
                                                    className="handbook-title"
                                                    title={item.name}
                                                >
                                                    {truncateText(item.name, 60)}
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

// Bọc withRouter ở ngoài cùng để dùng được this.props.history
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Handbook));