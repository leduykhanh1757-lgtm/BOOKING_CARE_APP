import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

class About extends Component {
    render() {
        return (
            <div className="section-share section-about">
                <div className="section-container">
                    <div className="section-about-header">
                        Truyền thông nói về Lê Duy Khánh
                    </div>
                    <div className="section-about-content">

                        {/* NỬA BÊN TRÁI: CHỨA VIDEO YOUTUBE */}
                        <div className="content-left">
                            <iframe
                                width="100%"
                                height="400px"
                                src="https://youtu.be/SQHhnoYzqCU?si=fW92wWWmcE4OdD48" /* Lát mình thay Link của bạn vào đây */
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen>
                            </iframe>
                        </div>

                        {/* NỬA BÊN PHẢI: CHỨA CHỮ GIỚI THIỆU */}
                        <div className="content-right">
                            <p>
                                Xin chào! Mình là Lê Duy Khánh. Đây là trang web đặt lịch khám bệnh trực tuyến được xây dựng dựa trên bản sao của BookingCare.
                                <br /> <br />
                                Dự án này giúp bệnh nhân dễ dàng tìm kiếm bác sĩ, cơ sở y tế và đặt lịch hẹn một cách nhanh chóng, tiện lợi.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
