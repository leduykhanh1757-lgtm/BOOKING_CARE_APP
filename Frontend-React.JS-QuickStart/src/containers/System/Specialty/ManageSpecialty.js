import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSpecialty.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'
import { CommonUtils } from '../../../utils';
import { createNewSpecialty, getAllSpecialty, getAllDetailSpecialtyById, editSpecialtyService } from '../../../services/userService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';

const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',

            listSpecialty: [],
            selectedSpecialty: '',
            hasOldData: false,
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            let dataSelect = this.buildDataInputSelect(res.data);
            this.setState({ listSpecialty: dataSelect })
        }
    }

    buildDataInputSelect = (inputData) => {
        return inputData && inputData.length > 0 ? inputData.map(item => ({ label: item.name, value: item.id })) : [];
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedSpecialty: selectedOption });

        // Gửi kèm location='ALL' vì API cũ đang yêu cầu
        let res = await getAllDetailSpecialtyById({ id: selectedOption.value, location: 'ALL' });
        if (res && res.errCode === 0 && res.data) {
            let data = res.data;
            this.setState({
                name: data.name,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                imageBase64: data.image ? data.image : '',
                hasOldData: true
            })
        }
    }

    handleClearForm = () => {
        this.setState({
            selectedSpecialty: '',
            name: '',
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

    handleSaveNewSpecialty = async () => {
        let { hasOldData } = this.state;

        if (hasOldData === false) {
            let res = await createNewSpecialty(this.state);
            if (res && res.errCode === 0) {
                toast.success('Thêm chuyên khoa thành công!');
                this.handleClearForm();
                this.componentDidMount();
            } else {
                toast.error('Lỗi thêm mới chuyên khoa!');
            }
        } else {
            let res = await editSpecialtyService({
                id: this.state.selectedSpecialty.value,
                name: this.state.name,
                imageBase64: this.state.imageBase64,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown,
            });
            if (res && res.errCode === 0) {
                toast.success('Cập nhật chuyên khoa thành công!');
                this.handleClearForm();
                this.componentDidMount();
            } else {
                toast.error('Lỗi cập nhật chuyên khoa!');
            }
        }
    }

    render() {
        let { hasOldData } = this.state;
        return (
            <div className="manage-specialty-container">
                <div className="ms-title"><FormattedMessage id="admin.manage-specialty.title" /></div>

                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-specialty.select-specialty" /></label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelect}
                            options={this.state.listSpecialty}
                            placeholder={<FormattedMessage id="admin.manage-specialty.select-specialty" />}
                        />
                        <button className="btn btn-secondary mt-2" onClick={() => this.handleClearForm()}>
                            <i className="fas fa-plus"></i> Reset Form
                        </button>
                    </div>

                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-specialty.image" /></label>
                        <div className="preview-img-container">
                            <input id="previewImgSpecialty" type="file" hidden
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                            <label className="label-upload" htmlFor="previewImgSpecialty">
                                Tải ảnh lên <i className="fas fa-upload"></i>
                            </label>
                            <div className="preview-image"
                                style={{ backgroundImage: `url(${this.state.imageBase64})` }}
                            ></div>
                        </div>
                    </div>

                    <div className="col-6 form-group mt-3">
                        <label><FormattedMessage id="admin.manage-specialty.name" /></label>
                        <input className="form-control" type="text" value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>

                    <div className="col-12 md-editor mt-4">
                        <MdEditor
                            style={{ height: '350px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>

                    <div className="col-12">
                        <button
                            className={hasOldData === true ? "btn btn-warning mt-3 notranslate" : "btn btn-primary mt-3 notranslate"}
                            onClick={() => this.handleSaveNewSpecialty()}
                        >
                            {hasOldData === true ?
                                <FormattedMessage id="admin.manage-specialty.save" /> :
                                <FormattedMessage id="admin.manage-specialty.add" />
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
export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);