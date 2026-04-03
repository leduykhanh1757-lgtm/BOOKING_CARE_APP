import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";

import handbookImg from '../../../assets/specialty/TAIMUIHONG.jpg';

class Handbook extends Component {
    render() {

        // 1. Dữ liệu bài viết mẫu
        let dataHandbook = [
            { title: '7 Chuyên gia Tham vấn Tâm lý hôn nhân gia đình online uy tín', image: handbookImg },
            { title: 'Top 5 Phòng khám Nha khoa uy tín tại TP.HCM', image: handbookImg },
            { title: 'Review 5 Bệnh viện khám xương khớp tốt nhất Hà Nội', image: handbookImg },
            { title: 'Dấu hiệu sớm nhận biết bệnh trào ngược dạ dày', image: handbookImg },
            { title: 'Kinh nghiệm đi khám tại Bệnh viện Đại học Y Dược 1', image: handbookImg },
        ];

        return (
            // Dùng chung class section-share, thêm class riêng section-handbook
            <div className="section-share section-handbook">
                <div className="section-container">
                    <div className="section-header">
                        <h3>Cẩm nang</h3>
                        <button>TẤT CẢ BÀI VIẾT</button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>

                            {/* 2. DÙNG .map() ĐỂ HIỂN THỊ */}
                            {dataHandbook && dataHandbook.length > 0 &&
                                dataHandbook.map((item, index) => {
                                    return (
                                        // Vẫn giữ tuyệt chiêu bọc màng co
                                        <div key={index}>
                                            <div className="handbook-customize">

                                                {/* Ảnh bài viết */}
                                                <div
                                                    className="bg-image"
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                ></div>

                                                {/* Tiêu đề bài viết */}
                                                <h3 className="handbook-title">{item.title}</h3>
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

export default connect(mapStateToProps, mapDispatchToProps)(Handbook);