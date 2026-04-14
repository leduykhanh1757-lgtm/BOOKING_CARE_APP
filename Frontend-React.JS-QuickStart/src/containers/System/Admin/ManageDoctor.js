import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ManageDoctor.scss';
import * as actions from '../../../store/actions';

// Import thư viện Markdown
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { getDetailInforDoctor } from '../../../services/userService';
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
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors(); // Gọi API lấy danh sách bác sĩ khi component được mount
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
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        })
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
        console.log('Selected doctor:', selectedDoctor);
        // Gọi API lấy thông tin bác sĩ
        let res = await getDetailInforDoctor(selectedDoctor.value);

        // Nếu bác sĩ đã có thông tin (có cục markdownData)
        if (res && res.errCode === 0 && res.data && res.data.markdownData) {
            let markdown = res.data.markdownData;
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true
            });
        } else {
            // Nếu bác sĩ mới toanh chưa có thông tin -> Xóa trắng form
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false
            });
        }
    };

    handleOnChangeDesc = (event) => {
        this.setState({
            description: event.target.value
        })
    }

    handleSaveContentMarkdown = () => {
        let { contentHTML, contentMarkdown, description, selectedDoctor } = this.state;

        // 1. Kiểm tra Validate (Tránh lưu dữ liệu rỗng)
        if (!selectedDoctor || !selectedDoctor.value) {
            toast.error("Vui lòng chọn một Bác sĩ!");
            return;
        }
        if (!description || !contentMarkdown || !contentHTML) {
            toast.error("Vui lòng nhập đầy đủ thông tin giới thiệu!");
            return;
        }

        // 2. Gọi API qua Redux để lưu dữ liệu
        this.props.saveDetailDoctor({
            contentHTML: contentHTML,
            contentMarkdown: contentMarkdown,
            description: description,
            doctorId: selectedDoctor.value // Lấy ID của bác sĩ từ cái React Select
        });

        // Reset lại Form sau khi lưu thành công
        this.setState({
            contentHTML: '',
            contentMarkdown: '',
            description: '',
            selectedDoctor: '',
        });
    }

    buildDataInputSelect = (inputData, keyId, keyName) => {
        let result = [];
        let { language } = this.props;

        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                // Tùy biến Họ Tên theo chuẩn Việt Nam hoặc Tiếng Anh
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;

                // Trả về dữ liệu chuẩn cho react-select
                object.label = language === 'vi' ? labelVi : labelEn;
                object.value = item.id;
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
                    TẠO THÊM THÔNG TIN BÁC SĨ
                </div>

                <div className='more-infor'>
                    <div className="content-left form-group">
                        <label>Chọn bác sĩ</label>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            placeholder="Vui lòng chọn bác sĩ..."
                        />
                    </div>
                    <div className='content-right'>
                        <label>Thông tin giới thiệu</label>
                        <textarea className='form-control'
                            rows='4'
                            onChange={(event) => this.handleOnChangeDesc(event)}
                            value={this.state.description}
                        >
                        </textarea>
                    </div>

                </div>

                <div className="manage-doctor-editor">
                    <MdEditor
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>

                <button
                    className={hasOldData === true ? "save-content-doctor" : "create-content-doctor"}
                    onClick={() => this.handleSaveContentMarkdown()}
                >
                    {hasOldData === true ? "Lưu thay đổi" : "Lưu thông tin"}
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: (id) => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);