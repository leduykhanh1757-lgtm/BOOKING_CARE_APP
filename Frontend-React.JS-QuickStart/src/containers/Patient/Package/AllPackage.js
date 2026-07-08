import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './AllPackage.scss';
import { getAllPackagesApi } from '../../../services/userService';
class AllPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listPackages: []
        }
    }

    async componentDidMount() {
        let res = await getAllPackagesApi('general');
        if (res && res.errCode === 0) {
            this.setState({
                listPackages: res.data ? res.data : []
            })
        }
    }

    handleViewDetail = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-service/${item.id}`);
        }
    }

    render() {
        let { listPackages } = this.state;

        return (
            <div className="all-package-container">
                <HomeHeader isShowBanner={false} />

                {/* KHỐI 1: BANNER ĐỒNG BỘ CHUẨN XỊN */}
                <div className="package-banner">
                    <div className="banner-overlay">
                        <div className="banner-content">
                            <h2>Gói khám sức khỏe tổng quát</h2>
                            <p>Các gói khám được thiết kế khoa học, phù hợp với từng độ tuổi, giới tính và nhu cầu bảo vệ sức khỏe.</p>
                        </div>
                    </div>
                </div>

                <div className="package-body">
                    {/* KHỐI 2: ƯU ĐIỂM KHI KHÁM THEO GÓI */}
                    <div className="features-section">
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-stethoscope"></i></div>
                            <div className="feature-text">
                                <h4>Thiết kế khoa học</h4>
                                <p>Danh mục khám chi tiết, tối ưu chi phí và không phát sinh xét nghiệm thừa.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-hospital-alt"></i></div>
                            <div className="feature-text">
                                <h4>Cơ sở uy tín</h4>
                                <p>Hợp tác với các Bệnh viện, Phòng khám Đa khoa hàng đầu trên cả nước.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon"><i className="fas fa-clipboard-check"></i></div>
                            <div className="feature-text">
                                <h4>Tiết kiệm thời gian</h4>
                                <p>Đặt lịch trước, ưu tiên tiếp đón, giảm thiểu tối đa thời gian chờ đợi.</p>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI 3: DANH SÁCH GÓI KHÁM */}
                    <div className="package-services-section">
                        <h3 className="section-title">Danh sách Gói khám nổi bật</h3>
                        <div className="services-grid">
                            {listPackages && listPackages.length > 0 &&
                                listPackages.map((item, index) => {
                                    return (
                                        <div
                                            className="service-card"
                                            key={index}
                                            onClick={() => this.handleViewDetail(item)}
                                        >
                                            <div
                                                className="card-image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            >
                                                <div className="tag-hot">Được quan tâm</div>
                                            </div>
                                            <div className="card-info">
                                                <h4 className="srv-name">{item.name}</h4>
                                                <div className="srv-clinic">
                                                    <i className="far fa-hospital"></i> {item.clinic}
                                                </div>
                                                <div className="srv-bottom">
                                                    <div className="srv-price">{item.price}</div>
                                                    <button className="btn-book">Xem chi tiết</button>
                                                </div>
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

const mapStateToProps = state => { return {}; };
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(AllPackage);