import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './AllDoctor.scss';
import { getTopDoctorHomeService } from '../../../services/userService';

class AllDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDoctors: []
        }
    }

    async componentDidMount() {
        // Lấy 50 bác sĩ nổi bật nhất
        let res = await getTopDoctorHomeService(50);
        if (res && res.errCode === 0) {
            this.setState({
                dataDoctors: res.data ? res.data : []
            });
        }
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        }
    }

    render() {
        let { dataDoctors } = this.state;
        let { language } = this.props;

        return (
            <div className="all-doctor-container">
                <HomeHeader isShowBanner={false} />
                <div className="all-doctor-body">
                    <div className="all-doctor-content">
                        <div className="title-section">Bác sĩ nổi bật</div>

                        <div className="list-doctor">
                            {dataDoctors && dataDoctors.length > 0 &&
                                dataDoctors.map((item, index) => {
                                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;

                                    return (
                                        <div
                                            className="doctor-item"
                                            key={index}
                                            onClick={() => this.handleViewDetailDoctor(item)}
                                        >
                                            <div
                                                className="bg-image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
                                            <div className="doctor-name">
                                                {language === 'vi' ? nameVi : nameEn}
                                            </div>
                                            <div className="doctor-specialty">Chuyên khoa</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { language: state.app.language };
};

export default connect(mapStateToProps)(AllDoctor);