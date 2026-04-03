import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'; // Dùng nếu có quốc tế hóa
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
        console.log('check state arrDoctors: ', this.state.arrDoctors);

        return (
            <div className="section-share section-outstanding-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <h3><FormattedMessage id="homepage.outstanding-doctor" /></h3>
                        <button><FormattedMessage id="homepage.more-info" /></button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {arrDoctors && arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {

                                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;

                                    return (
                                        <div key={index} className="doctor-wrapper">
                                            <div className="doctor-customize">

                                                <div
                                                    className="bg-image"
                                                    style={{ backgroundImage: `url(${item.image})` }}
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