import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailSpecialty.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import { getAllDetailSpecialtyById } from '../../../services/userService';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import _ from 'lodash';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [], // Mảng này để chứa ID của các bác sĩ
            dataDetailSpecialty: {},
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            // Gọi API với location mặc định là 'ALL' (lấy toàn bộ bác sĩ toàn quốc)
            let res = await getAllDetailSpecialtyById({
                id: id,
                location: 'ALL'
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];

                // Bóc tách lấy đúng cái mảng doctorSpecialty từ data trả về
                if (data && data.doctorSpecialty) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        // Lặp qua mảng và chỉ nhặt lấy đúng cái doctorId nhét vào arrDoctorId
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                // Cập nhật lại State
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                })
            }
        }
    }

    render() {
        let { arrDoctorId, dataDetailSpecialty } = this.state;
        return (
            <div className="detail-specialty-container">
                <HomeHeader />
                <div className="detail-specialty-body">

                    {/* 1. HIỂN THỊ BÀI VIẾT GIỚI THIỆU CHUYÊN KHOA */}
                    <div className="description-specialty">
                        {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) &&
                            <div dangerouslySetInnerHTML={{ __html: dataDetailSpecialty.descriptionHTML }}></div>
                        }
                    </div>

                    {/* 2. HIỂN THỊ DANH SÁCH BÁC SĨ */}
                    <div className="search-sp-doctor">
                        {/* Lát nữa mình làm ô Select chọn Tỉnh thành ở đây */}
                    </div>

                    {arrDoctorId && arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => {
                            return (
                                <div className="each-doctor" key={index}>

                                    {/* CỘT TRÁI: Hiện ảnh, tên và thông tin chung */}
                                    <div className="dt-content-left">
                                        <div className="profile-doctor">
                                            <ProfileDoctor
                                                doctorId={item}
                                                isShowDescriptionDoctor={true}
                                                isShowLinkDetail={true}
                                                isShowPrice={false}
                                            // Tắt giá ở Profile đi vì cột phải đã hiện rồi
                                            />
                                        </div>
                                    </div>

                                    {/* CỘT PHẢI: Hiện Lịch khám và Giá khám */}
                                    <div className="dt-content-right">
                                        <div className="doctor-schedule">
                                            <DoctorSchedule
                                                doctorIdFromParent={item} // 🛠️ Truyền ID cho Lịch khám
                                            />
                                        </div>
                                        <div className="doctor-extra-infor">
                                            <DoctorExtraInfor
                                                doctorIdFromParent={item} // 🛠️ Truyền ID cho Giá khám
                                            />
                                        </div>
                                    </div>

                                </div>
                            )
                        })
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);