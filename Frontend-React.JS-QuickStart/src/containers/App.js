import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';
import HomePage from './HomePage/HomePage.js';
import DetailDoctor from './Patient/Doctor/DetailDoctor.js';
import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';
import { path } from '../utils'
import Home from '../routes/Home';
import Login from '../routes/Login';
import System from '../routes/System';
import CustomScrollbars from '../components/CustomScrollbars.js';
import { CustomToastCloseButton } from '../components/CustomToast';
import ConfirmModal from '../components/ConfirmModal';
import Doctor from '../routes/Doctor';
import 'react-toastify/dist/ReactToastify.css';
import VerifyEmail from './Patient/VerifyEmail/VerifyEmail';
import DetailSpecialty from './Patient/Specialty/DetailSpecialty';
import DetailClinic from './Patient/Clinic/DetailClinic';
import DetailHandbook from './Patient/Handbook/DetailHandbook';
import AllSpecialty from './Patient/Specialty/AllSpecialty';
import AllClinic from './Patient/Clinic/AllClinic';
import AllDoctor from './Patient/Doctor/AllDoctor';
import AllHandbook from './Patient/Handbook/AllHandbook';
import SupportPage from './Patient/Support/SupportPage';
import UserLogin from './Auth/UserLogin';
class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <ConfirmModal />


                        <div className="content-container">
                            <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                                <Switch>
                                    <Route path={path.HOME} exact component={(Home)} />

                                    {/* ROUTE CHO ADMIN (Đăng nhập quản trị) */}
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />

                                    {/* ROUTE DÀNH CHO BÁC SĨ */}
                                    <Route path={'/doctor/'} component={userIsAuthenticated(Doctor)} />

                                    {/* CÁC ROUTE PUBLIC DÀNH CHO BỆNH NHÂN (Không cần đăng nhập vẫn xem được) */}
                                    <Route path={path.HOMEPAGE} component={HomePage} />
                                    <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                                    <Route path="/all-doctors" component={AllDoctor} />
                                    <Route path={path.VERIFY_EMAIL_BOOKING} component={VerifyEmail} />
                                    <Route path={path.DETAIL_SPECIALTY} component={DetailSpecialty} />
                                    <Route path="/all-specialty" component={AllSpecialty} />
                                    <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                                    <Route path="/all-clinic" component={AllClinic} />
                                    <Route path={path.DETAIL_HANDBOOK} component={DetailHandbook} />
                                    <Route path="/all-handbook" component={AllHandbook} />
                                    <Route path="/support" component={SupportPage} />

                                    {/* 🛠️ THÊM ROUTE CHO BỆNH NHÂN ĐĂNG NHẬP Ở ĐÂY NÀY */}
                                    <Route path="/user-login" component={UserLogin} />

                                </Switch>
                            </CustomScrollbars>
                        </div>

                        <ToastContainer
                            position="bottom-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick={true}
                            rtl={false}
                            pauseOnFocusLoss={true}
                            draggable={true}
                            pauseOnHover={true}
                        />

                    </div>
                </Router>
            </Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);