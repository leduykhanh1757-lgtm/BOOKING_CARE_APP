import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './AllSpecialty.scss';
import { getAllSpecialty } from '../../../services/userService';

class AllSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: []
        }
    }

    async componentDidMount() {
        // Tận dụng API đã có để lấy toàn bộ danh sách
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            });
        }
    }

    // Hàm chuyển sang trang chi tiết khi click vào 1 ô
    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        let { dataSpecialty } = this.state;

        return (
            <div className="all-specialty-container">
                {/* Gọi lại Header nhưng ẩn cái Banner to đùng đi */}
                <HomeHeader isShowBanner={false} />

                <div className="all-specialty-body">
                    <div className="all-specialty-content">
                        <div className="title-section">Khám chuyên khoa</div>

                        <div className="list-specialty">
                            {dataSpecialty && dataSpecialty.length > 0 &&
                                dataSpecialty.map((item, index) => {
                                    return (
                                        <div
                                            className="specialty-item"
                                            key={index}
                                            onClick={() => this.handleViewDetailSpecialty(item)}
                                        >
                                            <div
                                                className="bg-image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
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

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AllSpecialty);