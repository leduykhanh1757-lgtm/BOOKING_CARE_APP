import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";


import TAIMUIHONG from '../../../assets/specialty/TAIMUIHONG.jpg';
import TIMMACH from '../../../assets/specialty/TIMMACH.jpg';
import XUONGKHOP from '../../../assets/specialty/XUONGKHOP.png';
import THANKINH from '../../../assets/specialty/THANKINH.jpg';
import TIEUHOA from '../../../assets/specialty/TIEUHOA.jpg';
import SANPHUKHOA from '../../../assets/specialty/SANPHUKHOA.jpg';
import NHIKHOA from '../../../assets/specialty/NHIKHOA.jpg';
import DALIEU from '../../../assets/specialty/DALIEU.jpg';
import CHANTHUONGCHINHHINH from '../../../assets/specialty/CHANTHUONGCHINHHINH.jpg';
import NOITIET from '../../../assets/specialty/NOITIET.jpg';


class Specialty extends Component {
    render() {
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1
        };
        return (
            <div className="section-share section-specialty">
                <div className="section-container">
                    <div className="section-header">
                        <h3>Chuyên khoa phổ biến</h3>
                        <button>XEM THÊM</button>
                    </div>
                    <div className="section-body">
                        <Slider {...settings}>
                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${XUONGKHOP})` }} />
                                    <h3>Cơ xương khớp</h3>
                                </div>
                            </div>
                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${THANKINH})` }} />
                                    <h3>Thần kinh</h3>
                                </div>
                            </div>
                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${TIEUHOA})` }} />
                                    <h3>Tiêu hóa</h3>
                                </div>
                            </div>
                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${TIMMACH})` }} />
                                    <h3>Tim mạch</h3>
                                </div>
                            </div>
                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${TAIMUIHONG})` }} />
                                    <h3>Tai Mũi Họng</h3>
                                </div>
                            </div>
                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${SANPHUKHOA})` }} />
                                    <h3>Sản Phụ khoa</h3>
                                </div>
                            </div>
                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${NHIKHOA})` }} />
                                    <h3>Nhi khoa</h3>
                                </div>
                            </div>
                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${DALIEU})` }} />
                                    <h3>Da liễu</h3>
                                </div>
                            </div>
                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${CHANTHUONGCHINHHINH})` }} />
                                    <h3>Chấn thương chỉnh hình</h3>
                                </div>
                            </div>
                            <div>
                                <div className="img-customize">
                                    <div className="bg-image" style={{ backgroundImage: `url(${NOITIET})` }} />
                                    <h3>Nội Tiết - Tiểu đường</h3>
                                </div>
                            </div>

                        </Slider>
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

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
