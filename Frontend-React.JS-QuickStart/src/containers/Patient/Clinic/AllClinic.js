import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './AllClinic.scss';
import { getAllClinic } from '../../../services/userService';

class AllClinic extends Component {
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
            });
        }
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`);
        }
    }

    render() {
        let { dataClinics } = this.state;

        return (
            <div className="all-clinic-container">
                <HomeHeader isShowBanner={false} />
                <div className="all-clinic-body">
                    <div className="all-clinic-content">
                        <div className="title-section">Cơ sở y tế nổi bật</div>

                        <div className="list-clinic">
                            {dataClinics && dataClinics.length > 0 &&
                                dataClinics.map((item, index) => {
                                    return (
                                        <div
                                            className="clinic-item"
                                            key={index}
                                            onClick={() => this.handleViewDetailClinic(item)}
                                        >
                                            <div
                                                className="bg-image"
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
                                            <div className="clinic-name">{item.name}</div>
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

export default connect()(AllClinic);