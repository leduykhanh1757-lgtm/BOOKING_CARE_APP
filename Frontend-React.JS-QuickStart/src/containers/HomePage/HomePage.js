import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import Specialty from './Section/Specialty';
import MedicalFacility from './Section/MedicalFacility';
import Doctor from './Section/Doctor';
import HandBook from './Section/HandBook';
import About from './Section/About';
import HomeFooter from './HomeFooter';
import './HomePage.scss';
import "slick-carousel/slick/slick.css";// thư viện chứa cái <- và -> và slick-prev, slick-next
import "slick-carousel/slick/slick-theme.css";

class HomePage extends Component {


    render() {
        return (
            <div>
                <HomeHeader />
                <Specialty />
                <MedicalFacility />
                <Doctor />
                <HandBook />
                <About />
                <HomeFooter />
            </div>

        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
