import React, { Component } from 'react';
import './Chatbot.scss';
import { askChatbotApi } from '../../../services/userService';

class Chatbot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            inputText: '',
            messages: [
                { sender: 'bot', text: 'Chào bạn! Mình là trợ lý ảo của BookingCare. Mình có thể giúp gì cho bạn hôm nay?' }
            ],
            isLoading: false // Trạng thái chờ AI gõ phím
        };
        this.messagesEndRef = React.createRef(); // Ref để cuộn trang
    }

    toggleChat = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    scrollToBottom = () => {
        if (this.messagesEndRef.current) {
            this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    componentDidUpdate() {
        this.scrollToBottom(); // Cứ có tin nhắn mới là tự cuộn xuống
    }

    handleOnChangeInput = (event) => {
        this.setState({ inputText: event.target.value });
    }

    handleSendMessage = async () => {
        let { inputText, messages } = this.state;
        if (!inputText.trim()) return;

        let newMessages = [...messages, { sender: 'user', text: inputText }];
        this.setState({
            messages: newMessages,
            inputText: '',
            isLoading: true
        });

        // 🛠️ BỌC TRY...CATCH ĐỂ CHỐNG KẸT GIAO DIỆN
        try {
            let res = await askChatbotApi(inputText);

            if (res && res.errCode === 0) {
                this.setState({
                    messages: [...newMessages, { sender: 'bot', text: res.botReply }],
                    isLoading: false
                });
            } else {
                this.setState({
                    messages: [...newMessages, { sender: 'bot', text: 'Hệ thống AI từ chối trả lời (Lỗi logic). Vui lòng thử lại!' }],
                    isLoading: false
                });
            }
        } catch (error) {
            console.log("Chi tiết lỗi API:", error);
            this.setState({
                messages: [...newMessages, { sender: 'bot', text: 'Mất kết nối với máy chủ Backend hoặc AI lỗi! Bác hãy check lại cửa sổ Terminal Node.js nhé!' }],
                isLoading: false
            });
        }
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleSendMessage();
        }
    }

    render() {
        let { isOpen, messages, inputText, isLoading } = this.state;

        return (
            <div className="chatbot-container">
                {/* Nút bong bóng chat */}
                {!isOpen && (
                    <div className="chat-bubble" onClick={this.toggleChat}>
                        <i className="fas fa-comments"></i>
                    </div>
                )}

                {/* Khung chat bật lên */}
                {isOpen && (
                    <div className="chat-window">
                        <div className="chat-header">
                            <span>Trợ lý BookingCare</span>
                            <i className="fas fa-times close-icon" onClick={this.toggleChat}></i>
                        </div>

                        <div className="chat-body">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message-row ${msg.sender}`}>
                                    <div className="message-content">{msg.text}</div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message-row bot">
                                    <div className="message-content typing">AI đang gõ...</div>
                                </div>
                            )}
                            <div ref={this.messagesEndRef} />
                        </div>

                        <div className="chat-footer">
                            <input
                                type="text"
                                placeholder="Nhập câu hỏi..."
                                value={inputText}
                                onChange={this.handleOnChangeInput}
                                onKeyDown={this.handleKeyDown}
                            />
                            <button onClick={this.handleSendMessage}><i className="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Chatbot;