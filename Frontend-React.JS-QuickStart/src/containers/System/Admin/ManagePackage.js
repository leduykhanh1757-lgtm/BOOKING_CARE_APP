import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManagePackage.scss';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';
import CommonUtils from '../../../utils/CommonUtils';
import { createNewPackageApi, getAllClinic, getAllPackagesApi, editPackageService } from '../../../services/userService';
import { toast } from 'react-toastify';
import Select from 'react-select';

const mdParser = new MarkdownIt();

class ManagePackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            price: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',

            listClinics: [],
            selectedClinic: '', // 🛠️ Thay vì lưu clinicId dạng chuỗi, giờ lưu thành Object {label, value}

            listPackages: [],
            selectedPackage: '',
            hasOldData: false
        }
    }

    async componentDidMount() {
        let resClinic = await getAllClinic();
        let resPackage = await getAllPackagesApi();

        // 🛠️ Chế biến data Phòng khám cho thư viện react-select
        if (resClinic && resClinic.errCode === 0) {
            let dataClinicSelect = resClinic.data.map(item => ({
                label: item.name,
                value: item.id
            }));
            this.setState({
                listClinics: dataClinicSelect,
                selectedClinic: dataClinicSelect && dataClinicSelect.length > 0 ? dataClinicSelect[0] : ''
            });
        }

        if (resPackage && resPackage.errCode === 0) {
            let dataSelect = this.buildDataInputSelect(resPackage.data);
            this.setState({ listPackages: dataSelect });
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                object.label = item.name;
                object.value = item.id;
                object.price = item.price;
                object.clinicId = item.clinicId;
                object.descriptionHTML = item.descriptionHTML;
                object.descriptionMarkdown = item.descriptionMarkdown;
                object.image = item.image;
                result.push(object);
            })
        }
        return result;
    }

    handleChangeSelect = (selectedOption) => {
        let { listClinics } = this.state;

        // FIX 1: Dùng == (2 dấu bằng) thay vì === để nó tự động nhận dạng String và Integer
        let matchedClinic = listClinics.find(item => item.value == selectedOption.clinicId);

        this.setState({
            selectedPackage: selectedOption,
            name: selectedOption.label,
            price: selectedOption.price,
            selectedClinic: matchedClinic || '', // Gán đúng Object Phòng khám
            descriptionHTML: selectedOption.descriptionHTML,
            descriptionMarkdown: selectedOption.descriptionMarkdown,
            imageBase64: selectedOption.image ? selectedOption.image : '',
            hasOldData: true
        });
    }

    // 🛠️ Hàm riêng để xử lý khi người dùng chọn Dropdown Phòng khám
    handleChangeSelectClinic = (selectedOption) => {
        this.setState({ selectedClinic: selectedOption });
    }

    handleClearForm = () => {
        this.setState({
            selectedPackage: '', name: '', price: '', imageBase64: '',
            descriptionHTML: '', descriptionMarkdown: '', hasOldData: false,
            selectedClinic: this.state.listClinics.length > 0 ? this.state.listClinics[0] : ''
        });
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({ ...copyState });
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({ descriptionHTML: html, descriptionMarkdown: text });
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({ imageBase64: base64 });
        }
    }

    handleSavePackage = async () => {
        let { hasOldData, selectedClinic, selectedPackage } = this.state;

        // FIX 2: Bọc điều kiện an toàn, nếu selectedClinic tồn tại thì mới chọc vào .value
        let clinicIdToSave = (selectedClinic && selectedClinic.value) ? selectedClinic.value : '';

        let dataToSave = {
            name: this.state.name,
            price: this.state.price,
            clinicId: clinicIdToSave,
            imageBase64: this.state.imageBase64,
            descriptionHTML: this.state.descriptionHTML,
            descriptionMarkdown: this.state.descriptionMarkdown,
        };

        if (hasOldData === false) {
            // LƯU MỚI
            let res = await createNewPackageApi(dataToSave);
            if (res && res.errCode === 0) {
                toast.success("Thêm gói khám thành công!");
                this.handleClearForm();
                this.componentDidMount();
            } else {
                toast.error("Lỗi: " + res.errMessage);
            }
        } else {
            // CẬP NHẬT
            let res = await editPackageService({
                ...dataToSave,
                id: selectedPackage.value
            });

            if (res && res.errCode === 0) {
                toast.success("Cập nhật Gói khám thành công!");
                this.handleClearForm();
                this.componentDidMount();
            } else {
                toast.error("Lỗi cập nhật!");
            }
        }
    }

    render() {
        let { hasOldData, listClinics, selectedClinic } = this.state;

        return (
            <div className="manage-handbook-container">
                <div className="ms-title">Quản lý Gói Khám Sức Khỏe</div>

                <div className="add-new-handbook row">
                    <div className="col-6 form-group">
                        <label>Chọn gói khám (để chỉnh sửa)</label>
                        <Select
                            value={this.state.selectedPackage}
                            onChange={this.handleChangeSelect}
                            options={this.state.listPackages}
                            placeholder="Chọn gói khám để xem/sửa..."
                        />
                        <button className="btn btn-secondary mt-2" onClick={() => this.handleClearForm()}>
                            <i className="fas fa-plus"></i> Reset Form
                        </button>
                    </div>

                    <div className="col-6 form-group">
                        <label>Ảnh đại diện gói khám</label>
                        <div className="preview-img-container">
                            <input id="previewImgPackage" type="file" hidden onChange={(event) => this.handleOnChangeImage(event)} />
                            <label className="label-upload" htmlFor="previewImgPackage">
                                Tải ảnh lên <i className="fas fa-upload"></i>
                            </label>
                            <div className="preview-image" style={{ backgroundImage: `url(${this.state.imageBase64})` }}></div>
                        </div>
                    </div>

                    <div className="col-4 form-group mt-3">
                        <label>Tên gói khám</label>
                        <input className="form-control" type="text" value={this.state.name} onChange={(event) => this.handleOnChangeInput(event, 'name')} />
                    </div>

                    {/* 🛠️ DROPDOWN PHÒNG KHÁM ĐÃ ĐƯỢC NÂNG CẤP LÊN REACT-SELECT */}
                    <div className="col-4 form-group mt-3">
                        <label>Phòng khám / Bệnh viện</label>
                        <Select
                            value={selectedClinic}
                            onChange={this.handleChangeSelectClinic}
                            options={listClinics}
                            placeholder="Chọn phòng khám/bệnh viện..."
                        />
                    </div>

                    <div className="col-4 form-group mt-3">
                        <label>Giá tiền</label>
                        <input className="form-control" type="text" value={this.state.price} onChange={(event) => this.handleOnChangeInput(event, 'price')} />
                    </div>

                    <div className="col-12 md-editor mt-4">
                        <MdEditor style={{ height: '350px' }} renderHTML={text => mdParser.render(text)} onChange={this.handleEditorChange} value={this.state.descriptionMarkdown} />
                    </div>

                    <div className="col-12">
                        <button
                            className={hasOldData === true ? "btn btn-warning mt-3" : "btn btn-primary mt-3"}
                            onClick={() => this.handleSavePackage()}
                        >
                            {hasOldData === true ? "Lưu thay đổi" : "Tạo mới Gói khám"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => { return {}; };
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(ManagePackage);