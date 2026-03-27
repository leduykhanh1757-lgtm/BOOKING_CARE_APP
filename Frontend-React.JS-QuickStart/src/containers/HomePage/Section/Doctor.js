import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl'; // Dùng nếu có quốc tế hóa
import Slider from "react-slick";

import doctorImg from '../../../assets/specialty/CHANTHUONGCHINHHINH.jpg';


class Doctor extends Component {

    render() {
        // Cấu hình Slider giống hệt specialty
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1
        };

        // 1. TẠO DỮ LIỆU MẪU ĐỂ MAPPING (Làm app thật là data này lấy từ API về)
        let dataDoctors = [
            { name: 'Giáo sư, Tiến sĩ Trần Ngọc Ân', specialty: 'Cơ Xương Khớp 1', image: doctorImg },
            { name: 'Phó Giáo sư, Tiến sĩ Trần Đình Ngạn', specialty: 'Tim mạch 2', image: doctorImg },
            { name: 'Tiến sĩ, Bác sĩ Trịnh Thị Ngọc', specialty: 'Gan mật 3', image: doctorImg },
            { name: 'Bác sĩ CKII Nguyễn Tiến Lang', specialty: 'Tiêu hóa 4', image: doctorImg },
            { name: 'Giáo sư, Tiến sĩ Trần Ngọc Ân', specialty: 'Cơ Xương Khớp 5', image: doctorImg }, // Copy thêm cho đủ slider
        ]

        return (
            // Dùng chung class section-share, thêm class riêng section-outstanding-doctor
            <div className="section-share section-outstanding-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <h3>Bác sĩ nổi bật tuần qua</h3>
                        <button>XEM THÊM</button>
                    </div>
                    <div className="section-body">
                        <Slider {...settings}>

                            {/* 2. DÙNG .map() ĐỂ HIỂN THỊ */}
                            {dataDoctors && dataDoctors.length > 0 &&
                                dataDoctors.map((item, index) => {
                                    return (
                                        // TUYỆT CHIÊU BỌC VỎ: Thẻ div vô danh bọc ngoài y hệt specialty
                                        <div key={index} className="doctor-wrapper">
                                            <div className="doctor-customize">

                                                {/* Ảnh bác sĩ (hình tròn nhờ CSS) */}
                                                <div
                                                    className="bg-image"
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                ></div>

                                                {/* Chữ: Tên bác sĩ & Chuyên khoa */}
                                                <h4 className="doctor-name">{item.name}</h4>
                                                <h5 className="doctor-specialty">{item.specialty}</h5>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => { return { isLoggedIn: state.user.isLoggedIn }; };
const mapDispatchToProps = dispatch => { return {}; };

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);