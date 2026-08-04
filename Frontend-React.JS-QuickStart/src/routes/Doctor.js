import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from '../containers/Header/Header';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManagePatient from '../containers/System/Doctor/ManagePatient';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';

import { USER_ROLE } from '../utils/constant';

class Doctor extends Component {
    render() {
        const { isLoggedIn, userInfo } = this.props;

        if (!isLoggedIn) {
            return <Redirect to="/login" />;
        }

        if (userInfo && userInfo.roleId === USER_ROLE.PATIENT) {
            return <Redirect to="/home" />;
        }

        return (
            <React.Fragment>
                <Header />

                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                            <Route path="/doctor/manage-patient" component={ManagePatient} />
                            <Route path="/doctor/manage-doctor" component={ManageDoctor} />
                            <Route component={() => { return (<Redirect to={"/doctor/manage-schedule"} />) }} />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);