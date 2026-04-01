import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl'; // Dùng nếu có quốc tế hóa
import Slider from "react-slick";
import * as actions from '../../../store/actions';
import { getTopDoctorHomeService } from '../../../services/userService';
import { languages } from '../../../utils';

class Doctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors();
    }
    render() {
        let arrDoctors = this.state.arrDoctors;
        let { language } = this.props;
        arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors); // Nhân đôi mảng để có đủ 12 bác sĩ cho slider
        console.log('check state arrDoctors: ', this.state.arrDoctors);
        let settings = {
            dots: false,
            infinite: true, // Nếu data ít hơn 4 bác sĩ, bạn có thể cân nhắc đổi thành false để tránh lỗi UI lặp
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1
        };

        return (
            <div className="section-share section-outstanding-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <h3>Bác sĩ nổi bật tuần qua</h3>
                        <button>XEM THÊM</button>
                    </div>
                    <div className="section-body">
                        <Slider {...settings}>
                            {arrDoctors && arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {

                                    // Lấy trực tiếp item.image do Node.js gửi lên
                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = item.image;
                                    }

                                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;

                                    return (
                                        <div key={index} className="doctor-wrapper">
                                            <div className="doctor-customize">
                                                {/* Gắn vào background */}
                                                <div
                                                    className="bg-image"
                                                    style={{ backgroundImage: `url(${imageBase64})` }}
                                                ></div>

                                                <h4 className="doctor-name">
                                                    {language === 'vi' ? nameVi : nameEn}
                                                </h4>
                                                <h5 className="doctor-specialty">Cơ xương khớp</h5>
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

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors,
        language: state.app.language,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);