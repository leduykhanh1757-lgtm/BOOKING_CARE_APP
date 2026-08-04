import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageDoctor.scss';
import * as actions from '../../../store/actions';
import { FormattedMessage } from 'react-intl';
// Import thư viện Markdown
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { getDetailInforDoctor } from '../../../services/userService';
import { CRUD_actions, USER_ROLE } from '../../../utils';
import { getAllSpecialty } from '../../../services/userService';
import CustomLoadingOverlay from '../../../components/CustomLoadingOverlay';
// Khởi tạo bộ dịch
const mdParser = new MarkdownIt();

class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: '',
            description: '',
            listDoctors: [],
            hasOldData: false,

            nameClinic: '',
            addressClinic: '',
            note: '',
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listSpecialty: [],
            selectedSpecialty: '',
            listClinic: [],
            selectedClinic: '',
            isShowLoading: false
        }
    }

    async componentDidMount() {
        this.props.fetchAllDoctors(); // Gọi API lấy danh sách bác sĩ khi component được mount
        this.props.getRequiredDoctorInfor(); // Gọi API lấy các thông tin cần thiết khác 
        // (giá, phương thức thanh toán, tỉnh thành)
        let resSpecialty = await getAllSpecialty();
        if (resSpecialty && resSpecialty.errCode === 0) {
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty.data, 'SPECIALTY');
            this.setState({
                listSpecialty: dataSelectSpecialty
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // 1. Hứng danh sách bác sĩ
        if (
            prevProps.allDoctors !== this.props.allDoctors ||
            prevProps.userInfo !== this.props.userInfo
        ) {
            let listDocs = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            let { userInfo } = this.props;

            this.setState({
                listDoctors: listDocs
            }, () => {
                if (userInfo && userInfo.roleId === USER_ROLE.DOCTOR) {
                    let foundDoctor = listDocs.find(item => item.value === userInfo.id);
                    if (foundDoctor && (!this.state.selectedDoctor || this.state.selectedDoctor.value !== foundDoctor.value)) {
                        this.handleChangeSelect(foundDoctor);
                    }
                }
            });
        }

        // 2. Đón đầu sự kiện thay đổi Ngôn ngữ (Bắt buộc phải build lại TẤT CẢ)
        if (prevProps.language !== this.props.language) {
            // Lấy lại data từ Redux để dịch
            let { resPrice, resPayment, resProvince } = this.props.allRequiredDoctorInfor;

            this.setState({
                listDoctors: this.buildDataInputSelect(this.props.allDoctors, 'USERS'),
                listPrice: this.buildDataInputSelect(resPrice, 'PRICE'),
                listPayment: this.buildDataInputSelect(resPayment, 'PAYMENT'),
                listProvince: this.buildDataInputSelect(resProvince, 'PROVINCE'),
            });
        }

        // 3. Hứng dữ liệu bắt buộc (Giá, Thanh toán, Tỉnh thành, Chuyên khoa, Phòng khám)
        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPrice, resPayment, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;
            let { userInfo } = this.props;

            this.setState({
                listPrice: this.buildDataInputSelect(resPrice, 'PRICE'),
                listPayment: this.buildDataInputSelect(resPayment, 'PAYMENT'),
                listProvince: this.buildDataInputSelect(resProvince, 'PROVINCE'),
                listSpecialty: this.buildDataInputSelect(resSpecialty, 'SPECIALTY'),
                listClinic: this.buildDataInputSelect(resClinic, 'CLINIC'),
            }, () => {
                if (this.state.selectedDoctor && this.state.selectedDoctor.value) {
                    this.handleChangeSelect(this.state.selectedDoctor);
                } else if (userInfo && userInfo.roleId === USER_ROLE.DOCTOR && this.state.listDoctors.length > 0) {
                    let foundDoctor = this.state.listDoctors.find(item => item.value === userInfo.id);
                    if (foundDoctor) {
                        this.handleChangeSelect(foundDoctor);
                    }
                }
            });
        }
    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor });

        let res = await getDetailInforDoctor(selectedDoctor.value);

        if (res && res.errCode === 0 && res.data) {
            let markdown = res.data.markdownData || {};
            let doctorInfor = res.data.Doctor_Infor || {};

            let addressClinic = doctorInfor.addressClinic || '';
            let nameClinic = doctorInfor.nameClinic || '';
            let note = doctorInfor.note || '';
            let paymentId = doctorInfor.paymentId || '';
            let provinceId = doctorInfor.provinceId || '';
            let priceId = doctorInfor.priceId || '';
            let specialtyId = doctorInfor.specialtyId || '';
            let clinicId = doctorInfor.clinicId || '';

            let selectedPayment = this.state.listPayment.find(item => item && (item.value == paymentId || String(item.value).toLowerCase() === String(paymentId).toLowerCase())) || '';
            let selectedPrice = this.state.listPrice.find(item => item && (item.value == priceId || String(item.value).toLowerCase() === String(priceId).toLowerCase())) || '';
            let selectedProvince = this.state.listProvince.find(item => item && (item.value == provinceId || String(item.value).toLowerCase() === String(provinceId).toLowerCase())) || '';
            let selectedSpecialty = this.state.listSpecialty.find(item => item && (item.value == specialtyId || String(item.value).toLowerCase() === String(specialtyId).toLowerCase())) || '';
            let selectedClinic = this.state.listClinic.find(item => item && (item.value == clinicId || String(item.value).toLowerCase() === String(clinicId).toLowerCase())) || '';

            let hasOldData = !!(res.data.markdownData && (res.data.markdownData.contentHTML || res.data.markdownData.description) || res.data.Doctor_Infor);

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
        let stateName = name.name; // Lấy tên của select (được truyền qua thuộc tính name)
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

        // 1. Kiểm tra Validate phía Frontend
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
        // 🛠️ BỔ SUNG CHECK CHUYÊN KHOA Ở ĐÂY
        if (!selectedSpecialty || !selectedSpecialty.value) {
            toast.error("Vui lòng chọn một Chuyên khoa!");
            return;
        }

        this.setState({ isShowLoading: true });

        // 2. Gom hết tất cả đạn dược gửi qua Redux
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

        // 3. Xóa sạch form về trạng thái ban đầu sau khi lưu
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
            isShowLoading: false
        });
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;

        if (inputData && inputData.length > 0) {
            // Vòng lặp cha duy nhất duyệt qua danh sách
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
                // Chỉ cần gán object giống hệt Specialty, bỏ vòng lặp thừa
                if (type === 'CLINIC') {
                    object.label = item.name;
                    object.value = item.id;
                }

                // Đẩy object vào mảng kết quả
                result.push(object);
            })
        }
        return result;
    }

    render() {
        let { hasOldData } = this.state;
        let { userInfo } = this.props;
        let isDoctorRole = userInfo && userInfo.roleId === USER_ROLE.DOCTOR;

        return (
            <CustomLoadingOverlay active={this.state.isShowLoading} text="Đang lưu thông tin bác sĩ...">
                <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>

                <div className="add-new-doctor row">
                    {/* DÒNG 1: Chọn bác sĩ & Thông tin giới thiệu */}
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                        {isDoctorRole ? (
                            <input
                                type="text"
                                className="form-control"
                                value={this.state.selectedDoctor && this.state.selectedDoctor.label ? this.state.selectedDoctor.label : ''}
                                disabled
                            />
                        ) : (
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                                placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                            />
                        )}
                    </div>
                    <div className="col-8 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.intro" /></label>
                        <textarea className="form-control"
                            rows="3"
                            placeholder="Nhập thông tin giới thiệu ngắn về bác sĩ..."
                            onChange={(event) => this.handleOnChangeDesc(event)}
                            value={this.state.description}
                        >
                        </textarea>
                    </div>

                    {/* DÒNG 2: Giá - Thanh toán - Tỉnh thành */}
                    <div className="col-4 form-group mt-3">
                        <label><FormattedMessage id="admin.manage-doctor.price" /></label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPrice}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-price" />}
                            name="selectedPrice"
                        />
                    </div>
                    <div className="col-4 form-group mt-3">
                        <label><FormattedMessage id="admin.manage-doctor.payment" /></label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPayment}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-payment" />}
                            name="selectedPayment"
                        />
                    </div>
                    <div className="col-4 form-group mt-3">
                        <label><FormattedMessage id="admin.manage-doctor.province" /></label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listProvince}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-province" />}
                            name="selectedProvince"
                        />
                    </div>

                    {/* DÒNG 3: Tên PK - Địa chỉ PK - Ghi chú */}
                    <div className="col-4 form-group mt-3">
                        <label><FormattedMessage id="admin.manage-doctor.nameClinic" /></label>
                        <input className="form-control"
                            placeholder="Nhập tên phòng khám..."
                            onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                            value={this.state.nameClinic}
                        />
                    </div>
                    <div className="col-4 form-group mt-3">
                        <label><FormattedMessage id="admin.manage-doctor.addressClinic" /></label>
                        <input className="form-control"
                            placeholder="Nhập địa chỉ phòng khám..."
                            onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                            value={this.state.addressClinic}
                        />
                    </div>
                    <div className="col-4 form-group mt-3">
                        <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                        <input className="form-control"
                            placeholder="Nhập ghi chú thêm..."
                            onChange={(event) => this.handleOnChangeText(event, 'note')}
                            value={this.state.note}
                        />
                    </div>

                    {/* DÒNG 4: Chuyên khoa - Phòng khám */}
                    <div className="col-6 form-group mt-3">
                        <label><FormattedMessage id="admin.manage-doctor.specialty" /></label>
                        <Select
                            value={this.state.selectedSpecialty}
                            options={this.state.listSpecialty}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-specialty" />}
                            onChange={this.handleChangeSelectDoctorInfor}
                            name="selectedSpecialty"
                        />
                    </div>
                    <div className="col-6 form-group mt-3">
                        <label><FormattedMessage id="admin.manage-doctor.select-clinic" /></label>
                        <Select
                            value={this.state.selectedClinic}
                            options={this.state.listClinic}
                            placeholder={<FormattedMessage id="admin.manage-doctor.select-clinic" />}
                            onChange={this.handleChangeSelectDoctorInfor}
                            name="selectedClinic"
                        />
                    </div>

                    {/* DÒNG 5: Markdown Editor */}
                    <div className="col-12 manage-doctor-editor mt-4">
                        <MdEditor
                            style={{ height: '350px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.contentMarkdown}
                        />
                    </div>

                    {/* DÒNG 6: Nút thao tác */}
                    <div className="col-12">
                        <button
                            className={hasOldData === true ? "btn btn-warning mt-3" : "btn btn-primary mt-3"}
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
        </CustomLoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
        userInfo: state.user.userInfo,
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