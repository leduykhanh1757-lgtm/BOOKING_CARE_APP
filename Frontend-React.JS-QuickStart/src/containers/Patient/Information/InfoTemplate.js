import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './InfoTemplate.scss';

class InfoTemplate extends Component {
    render() {
        // Nhận title (Tiêu đề trang) và children (Toàn bộ nội dung HTML bên trong) từ component con truyền vào
        let { title, children } = this.props;

        return (
            <div className="info-template-container">
                <HomeHeader isShowBanner={false} />

                <div className="info-body">
                    <div className="info-content-wrapper">
                        <h2 className="info-title">{title}</h2>

                        {/* Khu vực render nội dung tùy biến của từng trang */}
                        <div className="info-main-content">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => { return {}; };
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(InfoTemplate);