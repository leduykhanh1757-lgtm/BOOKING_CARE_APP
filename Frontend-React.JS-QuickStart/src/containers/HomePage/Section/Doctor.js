import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";
import * as actions from '../../../store/actions';
import { languages } from '../../../utils';
import { withRouter } from 'react-router';
import './Doctor.scss';

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

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        }
    }

    handleViewMoreDoctor = () => {
        if (this.props.history) {
            this.props.history.push(`/all-doctors`);
        }
    }

    render() {
        let arrDoctors = this.state.arrDoctors;
        let { language } = this.props;

        return (
            <div className="section-share section-outstanding-doctor">
                <div className="section-container">
                    <div className="section-header notranslate">
                        <h3><FormattedMessage id="homepage.outstanding-doctor" /></h3>
                        <button onClick={() => this.handleViewMoreDoctor()}>
                            <FormattedMessage id="homepage.more-info" />
                        </button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {arrDoctors && arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {

                                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;

                                    // LOGIC LẤY TÊN CHUYÊN KHOA (Có check null an toàn)
                                    let specialtyName = '';
                                    if (item.Doctor_Infor && item.Doctor_Infor.specialtyData && item.Doctor_Infor.specialtyData.name) {
                                        specialtyName = item.Doctor_Infor.specialtyData.name;
                                    }

                                    return (
                                        <div key={index} className="doctor-wrapper" onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className="doctor-customize">

                                                <div
                                                    className="bg-image"
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                ></div>

                                                <h4 className="doctor-name notranslate">
                                                    {language === languages.VI ? nameVi : nameEn}
                                                </h4>
                                                {/* Tuyệt đối KHÔNG gắn notranslate ở đây để Google dịch được tên Chuyên khoa */}
                                                <h5 className="doctor-specialty">
                                                    <span>{specialtyName}</span>
                                                </h5>

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Doctor));