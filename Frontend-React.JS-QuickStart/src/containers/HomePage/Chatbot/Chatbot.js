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
            isLoading: false
        };
        this.messagesEndRef = React.createRef();
    }

    toggleChat = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    scrollToBottom = () => {
        if (this.messagesEndRef.current) {
            this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    // =====================================================================
    // TỐI ƯU 1: FIX BUG HIỆU NĂNG RẤT NẶNG Ở HÀM UPDATE
    // =====================================================================
    componentDidUpdate(prevProps, prevState) {
        // Chỉ tự động cuộn xuống ĐÁY khi Mảng tin nhắn có sự thay đổi 
        // hoặc khi trạng thái AI đang gõ (isLoading) thay đổi.
        if (prevState.messages.length !== this.state.messages.length || prevState.isLoading !== this.state.isLoading) {
            this.scrollToBottom();
        }
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
                {!isOpen && (
                    <div className="chat-bubble" onClick={this.toggleChat}>
                        <i className="fas fa-comments"></i>
                    </div>
                )}

                {isOpen && (
                    <div className="chat-window">
                        {/* CHỐT HẠ ĐA NGÔN NGỮ: Gắn notranslate vào Header để giữ nguyên tên thương hiệu */}
                        <div className="chat-header notranslate">
                            <span>Trợ lý BookingCare</span>
                            <i className="fas fa-times close-icon" onClick={this.toggleChat}></i>
                        </div>

                        {/* LƯU Ý: Tuyệt đối KHÔNG gắn notranslate vào chat-body, để Google thoải mái dịch nội dung chat */}
                        <div className="chat-body">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message-row ${msg.sender}`}>
                                    <div className="message-content">{msg.text}</div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message-row bot notranslate">
                                    <div className="message-content typing">AI đang gõ...</div>
                                </div>
                            )}
                            <div ref={this.messagesEndRef} />
                        </div>

                        {/* Gắn notranslate vào footer để cái Placeholder nhập liệu khỏi bị dịch bậy */}
                        <div className="chat-footer notranslate">
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