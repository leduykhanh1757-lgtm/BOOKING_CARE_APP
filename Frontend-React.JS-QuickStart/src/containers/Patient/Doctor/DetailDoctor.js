import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { getDetailInforDoctor } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';
import LikeAndShare from '../SocialPlugin/LikeAndShare';
import Comment from '../SocialPlugin/Comment';

class DetailDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailInforDoctor(id);
            if (res && res.errCode === 0) {
                this.setState({
                    detailDoctor: res.data,
                    currentDoctorId: id
                })
            }
        }
    }

    componentDidUpdate() {
    }

    render() {
        let { detailDoctor } = this.state;
        let { language } = this.props;

        let nameVi = '', nameEn = '';
        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }

        // Khai báo link cho Facebook
        // Nếu chạy localhost thì dùng 1 cái link ảo, nếu chạy thật trên mạng thì lấy link website thật
        let currentURL = process.env.REACT_APP_IS_LOCALHOST === "1" ?
            "https://bookingcare.vn/" : window.location.href;

        return (
            <React.Fragment>
                <HomeHeader isShowBanner={false} />

                <div className="doctor-detail-container">
                    <div className="intro-doctor">
                        {/* Hiển thị Ảnh */}
                        <div className='content-left'>
                            <div className="doctor-image"
                                style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})` }}
                            ></div>
                        </div>

                        {/* Hiển thị Tên và Mô tả ngắn */}
                        <div className='content-right'>
                            <div className='up'>
                                {language === 'vi' ? nameVi : nameEn}
                            </div>
                            <div className='down'>
                                {detailDoctor && detailDoctor.markdownData && detailDoctor.markdownData.description
                                    && <span>{detailDoctor.markdownData.description}</span>
                                }

                                {/* CHÈN NÚT LIKE & SHARE VÀO DƯỚI ĐOẠN GIỚI THIỆU */}
                                <div className="like-share-plugin" style={{ marginTop: '10px' }}>
                                    <LikeAndShare
                                        dataHref={currentURL}
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="schedule-doctor">
                        <div className="content-left">
                            <DoctorSchedule
                                doctorIdFromParent={this.state.currentDoctorId}
                            />
                        </div>
                        <div className="content-right">
                            <DoctorExtraInfor
                                doctorIdFromParent={this.state.currentDoctorId}
                            />
                        </div>
                    </div>

                    <div className="detail-infor-doctor">
                        {detailDoctor && detailDoctor.markdownData && detailDoctor.markdownData.contentHTML &&
                            <div dangerouslySetInnerHTML={{ __html: detailDoctor.markdownData.contentHTML }}>
                            </div>
                        }
                    </div>

                    {/*  CHÈN KHUNG COMMENT VÀO PHẦN ĐUÔI CÙNG */}
                    <div className="comment-doctor">
                        <Comment
                            dataHref={currentURL}
                            width={"100%"}
                            doctorIdFromParent={this.state.currentDoctorId}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailDoctor));