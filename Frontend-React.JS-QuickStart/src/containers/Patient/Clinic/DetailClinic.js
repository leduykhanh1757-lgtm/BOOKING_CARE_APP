import React, { Component } from 'react';
import './DetailClinic.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getAllDetailClinicById } from '../../../services/userService';
import _ from 'lodash';

class DetailClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getAllDetailClinicById({ id: id });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        // Dùng forEach thay vì map vì chỉ cần side-effect (push),
                        // không cần mảng mới trả về từ map
                        arr.forEach(item => {
                            arrDoctorId.push(item.doctorId);
                        })
                    }
                }

                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId,
                })
            }
        }
    }

    render() {
        let { arrDoctorId, dataDetailClinic } = this.state;

        return (
            <div className="detail-clinic-container">
                <HomeHeader />
                <div className="detail-clinic-body">
                    <div className="description-clinic">
                        {dataDetailClinic && !_.isEmpty(dataDetailClinic) &&
                            <>
                                {/* Tên cơ sở + nội dung mô tả -> dữ liệu động từ DB,
                                    để Google Translate tự dịch, không cần FormattedMessage */}
                                <div className="clinic-name">{dataDetailClinic.name}</div>
                                {/* Đổ nội dung bài viết HTML ra.
                                    Lưu ý: nếu descriptionHTML do người dùng/admin nhập tự do,
                                    cần đảm bảo backend đã sanitize để tránh XSS */}
                                <div dangerouslySetInnerHTML={{ __html: dataDetailClinic.descriptionHTML }}></div>
                            </>
                        }
                    </div>

                    <div className="detail-clinic-doctors">
                        {arrDoctorId && arrDoctorId.length > 0 &&
                            arrDoctorId.map((item) => {
                                return (
                                    <div className="each-doctor" key={item}>
                                        <div className="dt-content-left">
                                            <ProfileDoctor
                                                doctorId={item}
                                                isShowDescriptionDoctor={true}
                                                isShowLinkDetail={true}
                                                isShowPrice={false}
                                            />
                                        </div>
                                        <div className="dt-content-right">
                                            <div className="doctor-schedule">
                                                <DoctorSchedule doctorIdFromParent={item} />
                                            </div>

                                            <div className="doctor-extra-infor">
                                                <DoctorExtraInfor doctorIdFromParent={item} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default DetailClinic;