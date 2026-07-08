import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './ServiceTemplate.scss';
import { SERVICE_CONFIG } from './ServiceConfig';
import { getAllPackagesApi } from '../../../services/userService'; // 🛠️ 1. Import API lấy dữ liệu

class ServiceTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceType: '',
            configData: {},
            listData: [] // 🛠️ Mảng chứa danh sách các gói dịch vụ
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.type) {
            let type = this.props.match.params.type;
            let config = SERVICE_CONFIG[type];

            if (config) {
                this.setState({
                    serviceType: type,
                    configData: config
                });

                // TRUYỀN TYPE VÀO ĐÂY ĐỂ GỌI API LỌC
                let res = await getAllPackagesApi(type);

                if (res && res.errCode === 0) {
                    this.setState({ listData: res.data ? res.data : [] });
                }
            }
        }
    }

    // 🛠️ 3. Hàm kích hoạt chuyển trang sang giao diện Chi tiết Gói khám (Đã làm từ trước)
    handleViewDetail = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-service/${item.id}`);
        }
    }

    render() {
        let { configData, listData } = this.state;

        if (!configData || Object.keys(configData).length === 0) return <div>Không tìm thấy dịch vụ!</div>;

        return (
            <div className="all-package-container">
                <HomeHeader isShowBanner={false} />

                <div className="package-banner">
                    <div className="banner-overlay" style={{ background: configData.bannerBg }}>
                        <div className="banner-content">
                            <h2>{configData.title}</h2>
                            <p>{configData.desc}</p>
                        </div>
                    </div>
                </div>

                <div className="package-body">
                    <div className="features-section">
                        {configData.features && configData.features.map((item, index) => (
                            <div className="feature-item" key={index}>
                                <div className="feature-icon"><i className={item.icon}></i></div>
                                <div className="feature-text">
                                    <h4>{item.title}</h4>
                                    <p>{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="package-services-section">
                        <h3 className="section-title">Danh sách dịch vụ nổi bật</h3>
                        <div className="services-grid">

                            {/* 🛠️ 4. VẼ VÒNG LẶP ĐỔ DỮ LIỆU RA CÁC THẺ CARD */}
                            {listData && listData.length > 0 &&
                                listData.map((item, index) => {
                                    return (
                                        <div
                                            className="service-card"
                                            key={index}
                                            onClick={() => this.handleViewDetail(item)} // Gắn hàm Click vào đây
                                        >
                                            <div
                                                className="card-image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            >
                                                <div className="tag-hot">Được quan tâm</div>
                                            </div>
                                            <div className="card-info">
                                                <h4 className="srv-name">{item.name}</h4>
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
export default connect(mapStateToProps, mapDispatchToProps)(ServiceTemplate);