import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";

import facilityImg from '../../../assets/specialty/TAIMUIHONG.jpg';

class MedicalFacility extends Component {
    render() {
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1
        };

        return (
            // Dùng chung class section-share, thêm class riêng section-medical-facility
            <div className="section-share section-medical-facility">
                <div className="section-container">
                    <div className="section-header">
                        <h3>Cơ sở y tế nổi bật</h3>
                        <button>XEM THÊM</button>
                    </div>
                    <div className="section-body">
                        <Slider {...settings}>
                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${facilityImg})` }} />
                                    <h3>Bệnh viện Hữu nghị Việt Đức</h3>
                                </div>
                            </div>

                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${facilityImg})` }} />
                                    <h3>Bệnh viện Chợ Rẫy</h3>
                                </div>
                            </div>

                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${facilityImg})` }} />
                                    <h3>Phòng khám Bệnh viện Đại học Y Dược 1</h3>
                                </div>
                            </div>

                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${facilityImg})` }} />
                                    <h3>Bệnh viện K - Cơ sở Phan Chu Trinh</h3>
                                </div>
                            </div>

                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${facilityImg})` }} />
                                    <h3>Bệnh viện Ung Bướu Hưng Việt</h3>
                                </div>
                            </div>

                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => { return {}; };
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);