import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { languages, dateFormat, CRUD_actions } from '../../../utils';
import Select from 'react-select';
import * as actions from "../../../store/actions";
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import FormattedDate from '../../../components/Formating/FormattedDate';
import { range } from 'lodash';
import './ManageSchedule.scss';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManageSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: new Date(new Date().setHours(0, 0, 0, 0)),
            rangeTime: [],

        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors(); // Gọi API lấy danh sách bác sĩ khi component được mount
        this.props.fetchAllScheduleHours(); // Gọi API lấy danh sách thời gian làm việc của bác sĩ
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            this.setState({
                listDoctors: this.buildDataInputSelect(this.props.allDoctors)
            });
        }
        if (prevProps.language !== this.props.language) {
            this.setState({
                listDoctors: this.buildDataInputSelect(this.props.allDoctors)
            });
        }
        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            console.log(">>> CHECK ALL SCHEDULE TIME: ", this.props.allScheduleTime);
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelected: false }));
            }
            this.setState({
                rangeTime: data
            });
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === languages.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption });
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }
    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            });
            this.setState({
                rangeTime: rangeTime
            });
        }
    }
    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];
        if (!currentDate) {
            toast.error('Invalid date!');
            return;
        }
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error('Invalid selected doctor!');
            return;
        }

        let formattedDate = new Date(currentDate).getTime();

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.forEach(item => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formattedDate;
                    object.timeType = item.keyMap;
                    result.push(object);
                });
            } else {
                toast.error('Invalid selected time!');
                return;
            }
        }

        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formatedDate: formattedDate
        });

        if (res && res.errCode === 0) {
            toast.success("Lưu lịch khám thành công!");
        } else {
            toast.error("Lỗi lưu lịch khám...");
        }
    }
    render() {
        let { rangeTime } = this.state;
        let { language } = this.props;
        return (
            <div className="manage-schedule-container">
                <div className="m-s-title">

                    <FormattedMessage id="manage-schedule.manage-schedule" />
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-6 form-group">

                            <label><FormattedMessage id="manage-schedule.choose-doctor" /></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            />
                        </div>

                        <div className="col-6 form-group">

                            <label><FormattedMessage id="manage-schedule.select-date" /></label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}
                                minDate={new Date()}
                            />
                        </div>


                        <div className="col-12 pick-hour-container">
                            {rangeTime && rangeTime.length > 0 && rangeTime.map((item, index) => {
                                return (
                                    <button className={item.isSelected === true ?
                                        "btn btn-schedule active" : "btn btn-schedule"}
                                        key={index}
                                        onClick={() => this.handleClickBtnTime(item)}
                                    >
                                        {this.props.language === languages.VI ? item.valueVi : item.valueEn}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="col-12">
                            <button className="btn btn-primary btn-save-schedule"
                                onClick={() => this.handleSaveSchedule()}
                            >

                                <FormattedMessage id="manage-schedule.save-schedule" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleHours: () => dispatch(actions.fetchAllScheduleHours()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);