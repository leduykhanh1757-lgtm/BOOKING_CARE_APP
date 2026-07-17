import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';

import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';
import { path } from '../utils'

import Home from '../routes/Home';
import Login from '../routes/Login';
import System from '../routes/System';
import Doctor from '../routes/Doctor';

import CustomScrollbars from '../components/CustomScrollbars.js';
import ConfirmModal from '../components/ConfirmModal';
import 'react-toastify/dist/ReactToastify.css';

// --- IMPORT CÁC TRANG DÀNH CHO BỆNH NHÂN ---
import HomePage from './HomePage/HomePage.js';
import UserLogin from './Auth/UserLogin';
import UserProfile from './Patient/Profile/UserProfile';
import VerifyEmail from './Patient/VerifyEmail/VerifyEmail';
import UserRegister from './Auth/UserRegister';
import ForgotPassword from './Auth/ForgotPassword';

import DetailDoctor from './Patient/Doctor/DetailDoctor.js';
import AllDoctor from './Patient/Doctor/AllDoctor';

import DetailSpecialty from './Patient/Specialty/DetailSpecialty';
import AllSpecialty from './Patient/Specialty/AllSpecialty';

import DetailClinic from './Patient/Clinic/DetailClinic';
import AllClinic from './Patient/Clinic/AllClinic';

import DetailHandbook from './Patient/Handbook/DetailHandbook';
import AllHandbook from './Patient/Handbook/AllHandbook';

import AllPackage from './Patient/Package/AllPackage';
import DetailService from './Patient/Service/DetailService'; // Dùng cho Chi tiết Gói khám

// IMPORT TEMPLATE CHUNG CHO CÁC DỊCH VỤ CÒN LẠI
import ServiceTemplate from './Patient/Service/ServiceTemplate';

import SupportPage from './Patient/Support/SupportPage';

// --- IMPORT CÁC TRANG THÔNG TIN (INFORMATION) ---
import Cooperation from './Patient/Information/Cooperation';
import CorporateHealth from './Patient/Information/CorporateHealth';
import Contact from './Patient/Information/Contact';
import Regulations from './Patient/Information/Regulations';
import TermsOfUse from './Patient/Information/TermsOfUse';
import DigitalTransformation from './Patient/Information/DigitalTransformation';
import Recruitment from './Patient/Information/Recruitment';
import ForPatients from './Patient/Information/ForPatients';
import ForDoctors from './Patient/Information/ForDoctors';
import Role from './Patient/Information/Role';
import PrivacyPolicy from './Patient/Information/PrivacyPolicy';


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

                                    {/* CÁC ROUTE PUBLIC DÀNH CHO BỆNH NHÂN (Không cần đăng nhập) */}
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

                                    <Route path="/all-package" component={AllPackage} />
                                    <Route path="/detail-service/:id" component={DetailService} />

                                    {/* ROUTE ĐỘNG CHO CÁC DỊCH VỤ (Thay thế cho 6 Route cũ) */}
                                    <Route path="/service/:type" component={ServiceTemplate} />

                                    <Route path="/support" component={SupportPage} />

                                    {/* ROUTE CHO BỆNH NHÂN ĐĂNG NHẬP VÀ QUẢN LÝ */}
                                    <Route path="/user-login" component={UserLogin} />
                                    <Route path="/user-register" component={UserRegister} />
                                    <Route path="/forgot-password" component={ForgotPassword} />
                                    <Route path="/user/profile" component={UserProfile} />

                                    {/* NHÓM CÁC TRANG THÔNG TIN BÊN LỀ */}
                                    <Route path="/cooperation" component={Cooperation} />
                                    <Route path="/corporate-health" component={CorporateHealth} />
                                    <Route path="/contact" component={Contact} />
                                    <Route path="/regulations" component={Regulations} />
                                    <Route path="/terms" component={TermsOfUse} />
                                    <Route path="/digital-transformation" component={DigitalTransformation} />
                                    <Route path="/recruitment" component={Recruitment} />
                                    <Route path="/for-patients" component={ForPatients} />
                                    <Route path="/for-doctors" component={ForDoctors} />
                                    <Route path="/role" component={Role} />
                                    <Route path="/privacy-policy" component={PrivacyPolicy} />
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);