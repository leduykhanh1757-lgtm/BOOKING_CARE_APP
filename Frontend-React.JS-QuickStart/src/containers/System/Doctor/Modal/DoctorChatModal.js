import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { toast } from 'react-toastify';
import './DoctorChatModal.scss';
import { sendPrivateMessageApi, getPrivateMessagesApi } from '../../../../services/userService';

class DoctorChatModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageText: '',
            messages: [],
            isLoading: false
        }
    }

    componentDidMount() {
        if (this.props.dataModal && this.props.dataModal.doctorId) {
            this.fetchRealMessages(this.props.dataModal.doctorId, this.props.dataModal.patientId);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dataModal !== this.props.dataModal && this.props.dataModal && this.props.dataModal.doctorId) {
            this.fetchRealMessages(this.props.dataModal.doctorId, this.props.dataModal.patientId);
        }
    }

    fetchRealMessages = async (doctorId, patientId) => {
        if (!doctorId) return;
        this.setState({ isLoading: true });
        try {
            let res = await getPrivateMessagesApi(doctorId, patientId);
            if (res && res.errCode === 0 && res.messages) {
                this.setState({ messages: res.messages, isLoading: false });
            } else {
                this.setState({ messages: [], isLoading: false });
            }
        } catch (error) {
            console.error("Lỗi fetchRealMessages:", error);
            this.setState({ messages: [], isLoading: false });
        }
    }

    handleSendMessage = async () => {
        let { messageText } = this.state;
        let { dataModal, userInfo } = this.props;

        if (!messageText || !messageText.trim()) return;
        if (!dataModal || !dataModal.doctorId) {
            toast.error("Không xác định được Bác sĩ!");
            return;
        }

        let doctorName = userInfo ? `${userInfo.lastName} ${userInfo.firstName}` : 'Bác sĩ';
        let authorLabel = `BS. ${doctorName}`;

        try {
            let res = await sendPrivateMessageApi({
                doctorId: dataModal.doctorId,
                patientId: dataModal.patientId || 0,
                senderRole: 'DOCTOR',
                senderName: authorLabel,
                content: messageText.trim()
            });

            if (res && res.errCode === 0) {
                toast.success("Đã gửi tin nhắn dặn dò cho bệnh nhân!");
                this.setState({ messageText: '' });
                this.fetchRealMessages(dataModal.doctorId, dataModal.patientId);
            } else {
                toast.error("Lỗi gửi tin nhắn: " + (res?.errMessage || ""));
            }
        } catch (error) {
            console.error("Lỗi handleSendMessage:", error);
            toast.error("Đã xảy ra lỗi khi kết nối máy chủ!");
        }
    }

    handleQuickReply = (text) => {
        this.setState({ messageText: text });
    }

    render() {
        let { isOpenModal, closeChatModal, dataModal } = this.props;
        let { messageText, messages, isLoading } = this.state;

        return (
            <Modal
                isOpen={isOpenModal}
                toggle={closeChatModal}
                className="doctor-chat-modal-container"
                size="lg"
                centered
            >
                <ModalHeader toggle={closeChatModal} className="chat-modal-header">
                    <i className="fas fa-comments mr-2" style={{ color: '#6366f1' }}></i>
                    Trao đổi & Dặn dò Bệnh nhân: <span className="patient-name-highlight">{dataModal?.patientName || 'Bệnh nhân'}</span> ({dataModal?.email || ''})
                </ModalHeader>
                <ModalBody className="chat-modal-body">
                    <div className="chat-messages-box">
                        {isLoading ? (
                            <div className="text-center py-4 text-muted">
                                <i className="fas fa-spinner fa-spin mr-2"></i> Đang tải lịch sử tin nhắn từ cơ sở dữ liệu...
                            </div>
                        ) : (messages && messages.length > 0 ? (
                            messages.map((msg, index) => {
                                let isDoctorSender = msg.senderRole === 'DOCTOR' || (msg.senderName && msg.senderName.startsWith('BS.')) || (msg.authorName && msg.authorName.startsWith('BS.'));
                                let displayName = msg.senderName || msg.authorName || (isDoctorSender ? 'Bác sĩ' : 'Bệnh nhân');
                                return (
                                    <div key={index} className={`chat-bubble-wrapper ${isDoctorSender ? 'doctor-side' : 'patient-side'}`}>
                                        <div className="chat-bubble">
                                            <div className="chat-sender">{displayName}</div>
                                            <div className="chat-text">{msg.content}</div>
                                            <div className="chat-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-4 text-muted">Chưa có tin nhắn nào trong cơ sở dữ liệu cho lượt khám này.</div>
                        ))}
                    </div>

                    <div className="quick-reply-container mt-3">
                        <span className="quick-label"><i className="fas fa-bolt"></i> Mẫu câu dặn dò nhanh:</span>
                        <div className="quick-buttons">
                            <button className="btn-quick" onClick={() => this.handleQuickReply('Vui lòng mang theo hồ sơ/kết quả xét nghiệm cũ khi tới khám.')}>
                                <i className="fas fa-file-alt mr-1"></i> Hồ sơ cũ
                            </button>
                            <button className="btn-quick" onClick={() => this.handleQuickReply('Bạn nhớ nhịn ăn sáng nếu có xét nghiệm máu nhé.')}>
                                <i className="fas fa-vial mr-1"></i> Nhịn ăn sáng
                            </button>
                            <button className="btn-quick" onClick={() => this.handleQuickReply('Bác sĩ đã xác nhận lịch hẹn và chuẩn bị đón tiếp bạn.')}>
                                <i className="fas fa-check-circle mr-1"></i> Xác nhận tới khám
                            </button>
                        </div>
                    </div>

                    <div className="chat-input-row mt-3">
                        <textarea
                            className="form-control chat-input"
                            rows="2"
                            placeholder="Nhập nội dung tư vấn / dặn dò gửi xuống cơ sở dữ liệu..."
                            value={messageText}
                            onChange={(e) => this.setState({ messageText: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    this.handleSendMessage();
                                }
                            }}
                        ></textarea>
                        <Button color="primary" className="btn-send-message" onClick={this.handleSendMessage} title="Gửi tin nhắn">
                            <i className="fas fa-paper-plane"></i>
                        </Button>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={closeChatModal}>Đóng</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language,
    userInfo: state.user.userInfo
});

export default connect(mapStateToProps)(DoctorChatModal);
