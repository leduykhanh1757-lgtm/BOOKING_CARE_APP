import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailSpecialty.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import _ from 'lodash';
import { getAllDetailSpecialtyById, getAllCodeService } from '../../../services/userService';
import Select from 'react-select';

class DetailSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [], // Mảng này để chứa ID của các bác sĩ
            dataDetailSpecialty: {},
            listProvince: [],      //  Mảng chứa danh sách tỉnh thành
            selectedProvince: ''
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            // Gọi API lấy danh sách tỉnh thành
            let resProvince = await getAllCodeService('PROVINCE');
            if (resProvince && resProvince.errCode === 0) {
                let data = resProvince.data;
                let result = [];
                // Thêm option "Toàn quốc"
                result.push({ label: 'Toàn quốc', value: 'ALL' });
                if (data && data.length > 0) {
                    data.map(item => {
                        let object = {};
                        let labelVi = item.valueVi;
                        let labelEn = item.valueEn;
                        object.label = this.props.language === 'vi' ? labelVi : labelEn;
                        object.value = item.keyMap;
                        result.push(object);
                    });
                }
                this.setState({ listProvince: result });
            }
            // Gọi API với location mặc định là 'ALL' (lấy toàn bộ bác sĩ toàn quốc)
            this.getDetailSpecialty(id, 'ALL');
        }
    }

    getDetailSpecialty = async (id, location) => {
        let res = await getAllDetailSpecialtyById({ id: id, location: location });
        if (res && res.errCode === 0) {
            let data = res.data;
            let arrDoctorId = [];
            if (data && data.doctorSpecialty) {
                data.doctorSpecialty.map(item => arrDoctorId.push(item.doctorId));
            }
            this.setState({
                dataDetailSpecialty: res.data,
                arrDoctorId: arrDoctorId,
            });
        }
    }

    handleOnChangeSelect = async (event) => {
        let location = event.value;
        this.setState({ selectedProvince: event });
        this.getDetailSpecialty(this.props.match.params.id, location);
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
                        <Select
                            value={this.state.selectedProvince}
                            onChange={(event) => this.handleOnChangeSelect(event)}
                            options={this.state.listProvince}
                            placeholder="Chọn tỉnh thành"
                        />
                    </div>

                    {arrDoctorId && arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => {
                            return (
                                <div className="each-doctor" key={item}>

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