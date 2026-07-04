import React, { Component } from 'react';
import { connect } from 'react-redux';
import './About.scss';

class About extends Component {
    render() {
        return (
            <div className="section-share section-about">
                <div className="section-container">
                    <div className="section-about-header">
                        Truyền thông nói về nền tảng y tế BookingCare
                    </div>
                    <div className="section-about-content">

                        {/* NỬA BÊN TRÁI: VIDEO */}
                        <div className="content-left">
                            <iframe
                                width="100%"
                                height="350px"
                                src="https://www.youtube.com/embed/FyDQljKtWnI"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen>
                            </iframe>
                        </div>

                        {/* NỬA BÊN PHẢI: TRÍCH DẪN & NHÃN CSS (KHÔNG DÙNG ẢNH) */}
                        <div className="content-right">
                            <div className="media-quotes">
                                <i className="fas fa-quote-left quote-icon"></i>
                                <p className="quote-text">
                                    "Hệ thống đặt khám trực tuyến thông minh, giúp người bệnh tiết kiệm hàng giờ đồng hồ chờ đợi tại bệnh viện. Một bước tiến lớn cho nền y tế số."
                                </p>

                                <div className="css-logos">
                                    <span className="logo-badge vtv">VTV1</span>
                                    <span className="logo-badge vnexpress">VnExpress</span>
                                    <span className="logo-badge dantri">Dân Trí</span>
                                    <span className="logo-badge tuoitre">Tuổi Trẻ</span>
                                    <span className="logo-badge thanhnien">Thanh Niên</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(About);