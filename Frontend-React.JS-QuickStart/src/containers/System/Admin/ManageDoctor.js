import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import './ManageDoctor.scss';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { CRUD_actions, languages } from '../../../utils';
import { getDetailInforDoctor } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Save to Markdown table
            contentHTML: '',
            contentMarkdown: '',
            selectedDoctor: '',
            description: '',
            listDoctors: [],
            hasOldData: false,

            // Save to Doctor_Infor table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinic: [],
            listSpecialty: [],

            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',

            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: ''
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getRequiredDoctorInfor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');

            let { resPrice, resPayment, resProvince } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');

            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            })
        }

        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPrice, resPayment, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;

            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption });
        let { listPrice, listPayment, listProvince, listSpecialty, listClinic } = this.state;

        let res = await getDetailInforDoctor(selectedOption.value);
        if (res && res.errCode === 0 && res.data) {
            let markdown = res.data.Markdown || {};

            let addressClinic = '', nameClinic = '', note = '',
                paymentId = '', priceId = '', provinceId = '', specialtyId = '', clinicId = '',
                selectedPayment = '', selectedPrice = '', selectedProvince = '',
                selectedSpecialty = '', selectedClinic = '';

            if (res.data.Doctor_Infor) {
                addressClinic = res.data.Doctor_Infor.addressClinic || '';
                nameClinic = res.data.Doctor_Infor.nameClinic || '';
                note = res.data.Doctor_Infor.note || '';
                paymentId = res.data.Doctor_Infor.paymentId || '';
                priceId = res.data.Doctor_Infor.priceId || '';
                provinceId = res.data.Doctor_Infor.provinceId || '';
                specialtyId = res.data.Doctor_Infor.specialtyId || '';
                clinicId = res.data.Doctor_Infor.clinicId || '';

                selectedPayment = listPayment.find(item => item && item.value === paymentId) || '';
                selectedPrice = listPrice.find(item => item && item.value === priceId) || '';
                selectedProvince = listProvince.find(item => item && item.value === provinceId) || '';
                selectedSpecialty = listSpecialty.find(item => item && item.value === specialtyId) || '';
                selectedClinic = listClinic.find(item => item && item.value === clinicId) || '';
            }

            let hasOldData = !!(markdown.contentHTML || markdown.contentMarkdown || markdown.description || res.data.Doctor_Infor);

            this.setState({
                contentHTML: markdown.contentHTML || '',
                contentMarkdown: markdown.contentMarkdown || '',
                description: markdown.description || '',
                hasOldData: hasOldData,

                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPayment: selectedPayment,
                selectedPrice: selectedPrice,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic
            });
        } else {
            this.setState({
                contentHTML: '', contentMarkdown: '', description: '',
                hasOldData: false, addressClinic: '', nameClinic: '', note: '',
                selectedPayment: '', selectedPrice: '', selectedProvince: '',
                selectedSpecialty: '', selectedClinic: ''
            });
        }
    };

    handleChangeSelectDoctorInfor = (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeDesc = (event) => {
        this.setState({
            description: event.target.value
        })
    }

    handleSaveContentMarkdown = () => {
        let {
            hasOldData,
            contentHTML, contentMarkdown, description, selectedDoctor,
            selectedPrice, selectedPayment, selectedProvince,
            nameClinic, addressClinic, note, selectedSpecialty
        } = this.state;

        if (!selectedDoctor || !selectedDoctor.value) {
            toast.error("Vui lòng chọn một Bác sĩ!");
            return;
        }
        if (!description || !contentMarkdown || !contentHTML) {
            toast.error("Vui lòng nhập đầy đủ thông tin giới thiệu!");
            return;
        }
        if (!selectedPrice || !selectedPrice.value || !selectedPayment || !selectedPayment.value || !selectedProvince || !selectedProvince.value) {
            toast.error("Vui lòng chọn đầy đủ Giá, Phương thức thanh toán và Tỉnh thành!");
            return;
        }
        if (!nameClinic || !addressClinic) {
            toast.error("Vui lòng điền tên và địa chỉ phòng khám!");
            return;
        }
        if (!selectedSpecialty || !selectedSpecialty.value) {
            toast.error("Vui lòng chọn một Chuyên khoa!");
            return;
        }

        this.props.saveDetailDoctor({
            contentHTML: contentHTML,
            contentMarkdown: contentMarkdown,
            description: description,
            doctorId: selectedDoctor.value,
            action: hasOldData === true ? CRUD_actions.EDIT : CRUD_actions.CREATE,

            selectedPrice: selectedPrice.value,
            selectedPayment: selectedPayment.value,
            selectedProvince: selectedProvince.value,
            nameClinic: nameClinic,
            addressClinic: addressClinic,
            note: note,
            specialtyId: selectedSpecialty.value,
            clinicId: this.state.selectedClinic ? this.state.selectedClinic.value : null
        });

        this.setState({
            contentHTML: '',
            contentMarkdown: '',
            description: '',
            selectedDoctor: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedSpecialty: '',
            hasOldData: false,
            selectedClinic: '',
        });
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;

        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};

                if (type === 'USERS') {
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === 'vi' ? labelVi : labelEn;
                    object.value = item.id;
                }
                if (type === 'PRICE') {
                    let labelVi = `${item.valueVi} VNĐ`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === 'vi' ? labelVi : labelEn;
                    object.value = item.keyMap;
                }
                if (type === 'PAYMENT' || type === 'PROVINCE') {
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = language === 'vi' ? labelVi : labelEn;
                    object.value = item.keyMap;
                }
                if (type === 'SPECIALTY') {
                    object.label = item.name;
                    object.value = item.id;
                }
                if (type === 'CLINIC') {
                    object.label = item.name;
                    object.value = item.id;
                }

                result.push(object);
            })
        }
        return result;
    }

    render() {
        let { hasOldData } = this.state;
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>

                <div className="manage-doctor-body">
                    {/* HÀNG 1: Bác sĩ & Giới thiệu */}
                    <div className="row mb-3">
                        <div className="col-4 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                            />
                        </div>
                        <div className="col-8 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.intro" /></label>
                            <textarea className='form-control'
                                rows='3'
                                onChange={(event) => this.handleOnChangeDesc(event)}
                                value={this.state.description}
                            >
                            </textarea>
                        </div>
                    </div>

                    {/* HÀNG 2: Giá - Thanh toán - Tỉnh thành */}
                    <div className="row mb-3">
                        <div className="col-4 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.price" /></label>
                            <Select
                                value={this.state.selectedPrice}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listPrice}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-price" />}
                                name="selectedPrice"
                            />
                        </div>
                        <div className="col-4 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.payment" /></label>
                            <Select
                                value={this.state.selectedPayment}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listPayment}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-payment" />}
                                name="selectedPayment"
                            />
                        </div>
                        <div className="col-4 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.province" /></label>
                            <Select
                                value={this.state.selectedProvince}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listProvince}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-province" />}
                                name="selectedProvince"
                            />
                        </div>
                    </div>

                    {/* HÀNG 3: Tên PK - Địa chỉ PK - Ghi chú */}
                    <div className="row mb-3">
                        <div className="col-4 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.nameClinic" /></label>
                            <input className="form-control"
                                onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                                value={this.state.nameClinic}
                            />
                        </div>
                        <div className="col-4 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.addressClinic" /></label>
                            <input className="form-control"
                                onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                                value={this.state.addressClinic}
                            />
                        </div>
                        <div className="col-4 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                            <input className="form-control"
                                onChange={(event) => this.handleOnChangeText(event, 'note')}
                                value={this.state.note}
                            />
                        </div>
                    </div>

                    {/* HÀNG 4: Chuyên khoa - Phòng khám */}
                    <div className="row mb-4">
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.specialty" /></label>
                            <Select
                                value={this.state.selectedSpecialty}
                                options={this.state.listSpecialty}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-specialty" />}
                                onChange={this.handleChangeSelectDoctorInfor}
                                name="selectedSpecialty"
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="admin.manage-doctor.select-clinic" /></label>
                            <Select
                                value={this.state.selectedClinic}
                                options={this.state.listClinic}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-clinic" />}
                                onChange={this.handleChangeSelectDoctorInfor}
                                name="selectedClinic"
                            />
                        </div>
                    </div>

                    {/* HÀNG 5: Markdown Editor */}
                    <div className="row mb-4">
                        <div className="col-12 form-group">
                            <label>Bài viết thông tin chi tiết Bác sĩ</label>
                            <div className="manage-doctor-editor">
                                <MdEditor
                                    style={{ height: '400px' }}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={this.handleEditorChange}
                                    value={this.state.contentMarkdown}
                                />
                            </div>
                        </div>
                    </div>

                    {/* HÀNG 6: Nút Lưu */}
                    <div className="row">
                        <div className="col-12">
                            <button
                                className={hasOldData === true ? "btn btn-warning" : "btn btn-primary"}
                                onClick={() => this.handleSaveContentMarkdown()}
                            >
                                {hasOldData === true ?
                                    <span><FormattedMessage id="admin.manage-doctor.save" /></span> :
                                    <span><FormattedMessage id="admin.manage-doctor.add" /></span>
                                }
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
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);