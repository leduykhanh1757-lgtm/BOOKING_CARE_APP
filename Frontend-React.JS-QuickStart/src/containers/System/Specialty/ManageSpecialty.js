import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSpecialty.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { CommonUtils } from '../../../utils'; // Tiện ích chuyển ảnh sang Base64
import { createNewSpecialty } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
        }
    }

    // Hàm cập nhật state cho các ô input text thông thường
    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({ ...stateCopy });
    }

    // Hàm bắt sự kiện khi gõ vào khung soạn thảo Markdown
    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }

    // Hàm xử lý khi chọn ảnh
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64
            })
        }
    }

    // Nút bấm lưu (Tạm thời log ra xem data đã ăn chưa)
    handleSaveNewSpecialty = async () => {
        try {
            // Đưa logic gọi API vào trong try
            let res = await createNewSpecialty(this.state);

            if (res && res.errCode === 0) {
                toast.success('Thêm mới chuyên khoa thành công!');

                // Xóa trắng form sau khi lưu thành công
                this.setState({
                    name: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: ''
                });
            } else {
                toast.error('Lỗi thêm mới chuyên khoa!');
                console.log("Check lỗi:", res);
            }
        } catch (error) {
            // Đón lõng tất cả các lỗi văng ra do sập API hoặc file quá nặng
            toast.error('Lỗi kết nối API hoặc file ảnh quá lớn!');
            console.log("Check lỗi hệ thống:", error);
        }
    }

    render() {
        return (
            <div className="manage-specialty-container">
                <div className="ms-title">Quản lý chuyên khoa</div>

                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label>Tên chuyên khoa</label>
                        <input className="form-control" type="text"
                            value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>

                    <div className="col-6 form-group">
                        <label>Ảnh chuyên khoa</label>
                        <div className="preview-img-container">
                            <input id="previewImg" type="file" hidden
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                            {/* Dùng label bọc lấy id của input để làm nút bấm giả */}
                            <label className="label-upload" htmlFor="previewImg">
                                Tải ảnh lên <i className="fas fa-upload"></i>
                            </label>
                            {/* Khung chứa ảnh xem trước */}
                            <div className="preview-image"
                                style={{ backgroundImage: `url(${this.state.imageBase64})` }}
                            >
                            </div>
                        </div>
                    </div>

                    <div className="col-12 md-editor">
                        <MdEditor
                            style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>

                    <div className="col-12">
                        <button className="btn-save-specialty"
                            onClick={this.handleSaveNewSpecialty}
                        >
                            Lưu lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);