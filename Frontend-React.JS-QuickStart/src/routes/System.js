import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageHandbook from '../containers/System/Handbook/ManageHandbook';
import ManagePackage from '../containers/System/Admin/ManagePackage';
import { USER_ROLE } from '../utils/constant';

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn, userInfo } = this.props;

        if (!isLoggedIn) {
            return <Redirect to="/login" />;
        }

        if (userInfo) {
            let role = userInfo.roleId;
            if (role === USER_ROLE.DOCTOR) {
                return <Redirect to="/doctor/manage-schedule" />;
            }
            if (role === USER_ROLE.PATIENT) {
                return <Redirect to="/home" />;
            }
        }

        return (
            <React.Fragment>
                <Header />
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/system/user-manage" component={() => <Redirect to="/system/user-redux" />} />
                            <Route path="/system/user-redux" component={UserRedux} />
                            <Route path="/system/manage-doctor" component={ManageDoctor} />
                            <Route path="/system/manage-specialty" component={ManageSpecialty} />
                            <Route path="/system/manage-clinic" component={ManageClinic} />
                            <Route path="/system/manage-handbook" component={ManageHandbook} />
                            <Route path="/system/manage-package" component={ManagePackage} />
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />

                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
