import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageClinic.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from '../../../utils';
import { createNewClinic, getAllClinic, getAllDetailClinicById, editClinicService } from '../../../services/userService';
import { toast } from 'react-toastify';
import Select from 'react-select'; // 🛠️ Import thêm thư viện Select
import { FormattedMessage } from 'react-intl';

const mdParser = new MarkdownIt();

class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',

            // 🛠️ State cho chức năng Dropdown
            listClinic: [],
            selectedClinic: '',
            hasOldData: false, // Cờ hiệu để biết là Sửa hay Tạo mới
        }
    }

    async componentDidMount() {
        // Vừa vào trang là lấy danh sách phòng khám đổ vào ô Dropdown
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            let dataSelect = this.buildDataInputSelect(res.data);
            this.setState({ listClinic: dataSelect })
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                object.label = item.name;
                object.value = item.id;
                result.push(object);
            })
        }
        return result;
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedClinic: selectedOption });

        // Khi chọn 1 phòng khám, gọi API lấy chi tiết để fill lên form
        let res = await getAllDetailClinicById({ id: selectedOption.value });
        if (res && res.errCode === 0 && res.data) {
            let data = res.data;
            this.setState({
                name: data.name,
                address: data.address,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                imageBase64: data.image ? data.image : '',
                hasOldData: true // Bật cờ hiệu là đang Edit
            })
        }
    }

    // Nút Clear Form để tạo mới
    handleClearForm = () => {
        this.setState({
            selectedClinic: '',
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            hasOldData: false
        });
    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({ ...stateCopy })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({ imageBase64: base64 })
        }
    }

    handleSaveNewClinic = async () => {
        let { hasOldData } = this.state;

        if (hasOldData === false) {
            // TẠO MỚI
            let res = await createNewClinic(this.state);
            if (res && res.errCode === 0) {
                toast.success('Thêm phòng khám thành công!');
                this.handleClearForm(); // Tạo xong xóa form
                this.componentDidMount(); // Tải lại danh sách dropdown
            } else {
                toast.error('Lỗi thêm mới phòng khám!');
            }
        } else {
            // CHỈNH SỬA
            let res = await editClinicService({
                id: this.state.selectedClinic.value,
                name: this.state.name,
                address: this.state.address,
                imageBase64: this.state.imageBase64,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown,
            });
            if (res && res.errCode === 0) {
                toast.success('Cập nhật phòng khám thành công!');
                this.componentDidMount(); // Tải lại tên phòng khám trên dropdown lỡ người dùng có đổi tên
                this.handleClearForm();
            } else {
                toast.error('Lỗi cập nhật phòng khám!');
            }
        }
    }

    render() {
        let { hasOldData } = this.state;
        return (
            <div className="manage-clinic-container">
                <div className="ms-title"><FormattedMessage id="admin.manage-clinic.title" /></div>

                <div className="add-new-clinic row">
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-clinic.select-clinic" /></label>
                        <Select
                            value={this.state.selectedClinic}
                            onChange={this.handleChangeSelect}
                            options={this.state.listClinic}
                            placeholder={<FormattedMessage id="admin.manage-clinic.select-clinic" />}
                        />
                        <button className="btn btn-secondary mt-2" onClick={() => this.handleClearForm()}>
                            <i className="fas fa-plus"></i> Reset Form
                        </button>
                    </div>

                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-clinic.image" /></label>
                        <div className="preview-img-container">
                            <input id="previewImgClinic" type="file" hidden
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                            <label className="label-upload" htmlFor="previewImgClinic">
                                Tải ảnh lên <i className="fas fa-upload"></i>
                            </label>
                            <div className="preview-image"
                                style={{ backgroundImage: `url(${this.state.imageBase64})` }}
                            ></div>
                        </div>
                    </div>

                    <div className="col-6 form-group mt-3">
                        <label><FormattedMessage id="admin.manage-clinic.name" /></label>
                        <input className="form-control" type="text" value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group mt-3">
                        <label><FormattedMessage id="admin.manage-clinic.address" /></label>
                        <input className="form-control" type="text" value={this.state.address}
                            onChange={(event) => this.handleOnChangeInput(event, 'address')}
                        />
                    </div>

                    <div className="col-12 manage-clinic-editor mt-4">
                        <MdEditor
                            style={{ height: '350px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>

                    <div className="col-12">
                        <button
                            className={hasOldData === true ? "btn btn-warning mt-3" : "btn btn-primary mt-3"}
                            onClick={() => this.handleSaveNewClinic()}
                        >
                            {hasOldData === true ?
                                <FormattedMessage id="admin.manage-clinic.save" /> :
                                <FormattedMessage id="admin.manage-clinic.add" />
                            }
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => { return { language: state.app.language }; };
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);