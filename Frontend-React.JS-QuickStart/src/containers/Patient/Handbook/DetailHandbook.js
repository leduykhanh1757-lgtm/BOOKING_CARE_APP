import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader'; // 🛠️ Import thanh Header dùng chung
import { getDetailHandbookById } from '../../../services/userService'; // 🛠️ Import API mình vừa viết lúc nãy
import './DetailHandbook.scss';

class DetailHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDetailHandbook: {} // Chứa dữ liệu bài viết
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
                    dataDetailHandbook: res.data
                })
            }
        }
    }

    render() {
        let { dataDetailHandbook } = this.state;

        return (
            <div className="detail-handbook-container">
                {/* Tái sử dụng thanh Header của trang chủ (ẩn cái Banner đi) */}
                <HomeHeader isShowBanner={false} />

                <div className="handbook-body">
                    {/* Hiển thị Tên bài viết */}
                    <h2 className="handbook-title">
                        {dataDetailHandbook && dataDetailHandbook.name ? dataDetailHandbook.name : ''}
                    </h2>

                    {/* 🛠️ BÍ QUYẾT: Dùng dangerouslySetInnerHTML để React dịch đoạn mã HTML từ DB ra giao diện */}
                    <div className="handbook-content">
                        {dataDetailHandbook && dataDetailHandbook.descriptionHTML &&
                            <div dangerouslySetInnerHTML={{ __html: dataDetailHandbook.descriptionHTML }}></div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => { return { language: state.app.language }; };
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(DetailHandbook);