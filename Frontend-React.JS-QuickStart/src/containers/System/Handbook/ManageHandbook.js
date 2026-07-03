import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageHandbook.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CommonUtils } from '../../../utils';
import { createNewHandbook, getAllHandbook, editHandbookService, getDetailHandbookById } from '../../../services/userService';
import { toast } from 'react-toastify';
import Select from 'react-select';

const mdParser = new MarkdownIt();

class ManageHandbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',

            listHandbook: [],
            selectedHandbook: '',
            hasOldData: false,
        }
    }

    async componentDidMount() {
        let res = await getAllHandbook();
        if (res && res.errCode === 0) {
            let dataSelect = this.buildDataInputSelect(res.data);
            this.setState({ listHandbook: dataSelect })
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                object.label = item.name;
                object.value = item.id;
                // Lưu tạm data vào đây để lúc chọn Dropdown thì lôi ra dùng
                object.descriptionHTML = item.descriptionHTML;
                object.descriptionMarkdown = item.descriptionMarkdown;
                object.image = item.image;
                result.push(object);
            })
        }
        return result;
    }

    handleChangeSelect = async (selectedOption) => {
        // Cập nhật tên đang hiển thị trên thanh Select
        this.setState({ selectedHandbook: selectedOption });

        // Gọi API lấy full data (Tên, Ảnh, Markdown) của bài viết vừa chọn
        let res = await getDetailHandbookById({ id: selectedOption.value });

        if (res && res.errCode === 0 && res.data) {
            let data = res.data;
            this.setState({
                name: data.name,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                imageBase64: data.image ? data.image : '',
                hasOldData: true // Bật cờ chuyển sang chế độ Sửa
            })
        }
    }

    handleClearForm = () => {
        this.setState({
            selectedHandbook: '',
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

    handleSaveNewHandbook = async () => {
        let { hasOldData } = this.state;

        if (hasOldData === false) {
            let res = await createNewHandbook(this.state);
            if (res && res.errCode === 0) {
                toast.success('Thêm cẩm nang thành công!');
                this.handleClearForm();
                this.componentDidMount();
            } else {
                toast.error('Lỗi thêm mới cẩm nang!');
            }
        } else {
            let res = await editHandbookService({
                id: this.state.selectedHandbook.value,
                name: this.state.name,
                imageBase64: this.state.imageBase64,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown,
            });

            if (res && res.errCode === 0) {
                toast.success('Cập nhật cẩm nang thành công!');
                this.handleClearForm(); // Update xong thì clear form về giao diện trắng
                this.componentDidMount(); // Load lại data mới vào Dropdown
            } else {
                toast.error('Lỗi cập nhật cẩm nang!');
            }
        }
    }

    render() {
        let { hasOldData } = this.state;
        return (
            <div className="manage-handbook-container">
                <div className="ms-title">Quản lý Cẩm nang bài viết</div>

                <div className="add-new-handbook row">
                    <div className="col-6 form-group">
                        <label>Chọn cẩm nang (để chỉnh sửa)</label>
                        <Select
                            value={this.state.selectedHandbook}
                            onChange={this.handleChangeSelect}
                            options={this.state.listHandbook}
                            placeholder="Chọn bài viết cẩm nang..."
                        />
                        <button className="btn btn-secondary mt-2" onClick={() => this.handleClearForm()}>
                            <i className="fas fa-plus"></i> Reset Form
                        </button>
                    </div>

                    <div className="col-6 form-group">
                        <label>Ảnh đại diện bài viết</label>
                        <div className="preview-img-container">
                            <input id="previewImgHandbook" type="file" hidden
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                            <label className="label-upload" htmlFor="previewImgHandbook">
                                Tải ảnh lên <i className="fas fa-upload"></i>
                            </label>
                            {/* Truyền thẳng base64 vào đây */}
                            <div className="preview-image"
                                style={{ backgroundImage: `url(${this.state.imageBase64})` }}
                            ></div>
                        </div>
                    </div>

                    <div className="col-6 form-group mt-3">
                        <label>Tên bài viết</label>
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
                            className={hasOldData === true ? "btn btn-warning mt-3" : "btn btn-primary mt-3"}
                            onClick={() => this.handleSaveNewHandbook()}
                        >
                            {hasOldData === true ? "Lưu thay đổi" : "Tạo mới cẩm nang"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => { return { language: state.app.language }; };
const mapDispatchToProps = dispatch => { return {}; };
export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);