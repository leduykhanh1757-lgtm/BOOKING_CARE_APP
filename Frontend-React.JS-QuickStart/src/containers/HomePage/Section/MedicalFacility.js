import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { getAllClinic } from '../../../services/userService';
import './MedicalFacility.scss';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';

class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data ? res.data : []
            })
        }
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }

    // THÊM HÀM CHUYỂN TRANG TẤT CẢ PHÒNG KHÁM
    handleViewMoreClinic = () => {
        if (this.props.history) {
            this.props.history.push(`/all-clinic`);
        }
    }

    render() {
        let { dataClinics } = this.state;

        return (
            <div className="section-share section-medical-facility">
                <div className="section-container">
                    <div className="section-header notranslate">
                        <h3><FormattedMessage id="homepage.outstanding-medical-facility" /></h3>
                        <button onClick={() => this.handleViewMoreClinic()}>
                            <FormattedMessage id="homepage.more-info" />
                        </button>
                    </div>
                    <div className="section-body">
                        {dataClinics && dataClinics.length > 0 &&
                            <Slider {...this.props.settings}>
                                {dataClinics.map((item, index) => {
                                    return (
                                        <div
                                            className="section-customize clinic-child"
                                            key={index}
                                            onClick={() => this.handleViewDetailClinic(item)}
                                        >
                                            <div className="img-customize">
                                                <div
                                                    className="bg-image"
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                />
                                                <h3>
                                                    <span>{item.name}</span>
                                                </h3>
                                            </div>
                                        </div>
                                    )
                                })}
                            </Slider>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => { return {}; };
const mapDispatchToProps = dispatch => { return {}; };
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));