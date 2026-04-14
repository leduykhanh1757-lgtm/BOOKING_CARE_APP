import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { getDetailInforDoctor } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss';

class DetailDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {}
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailInforDoctor(id);
            if (res && res.errCode === 0) {
                this.setState({
                    detailDoctor: res.data
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
                            </div>
                        </div>
                    </div>
                    <div className="schedule-doctor">

                    </div>

                    <div className="detail-infor-doctor">
                        {detailDoctor && detailDoctor.markdownData && detailDoctor.markdownData.contentHTML &&
                            <div dangerouslySetInnerHTML={{ __html: detailDoctor.markdownData.contentHTML }}>
                            </div>
                        }
                    </div>
                    <div className="comment-doctor">
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