import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './SupportPage.scss';

class SupportPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeFaqId: null // Lưu ID của câu hỏi đang được mở
        }
    }

    // Hàm xử lý đóng/mở câu hỏi (Accordion)
    toggleFaq = (id) => {
        this.setState({
            activeFaqId: this.state.activeFaqId === id ? null : id
        });
    }

    render() {
        let { activeFaqId } = this.state;

        // Dữ liệu giả lập cho phần FAQ
        const faqs = [
            { id: 1, question: "Làm thế nào để đặt lịch khám bệnh?", answer: "Bạn có thể tìm kiếm bác sĩ hoặc chuyên khoa ở trang chủ, chọn thời gian phù hợp và điền thông tin cá nhân để hoàn tất đặt lịch. Sẽ có tin nhắn xác nhận gửi về số điện thoại của bạn." },
            { id: 2, question: "Tôi muốn hủy hoặc dời lịch khám thì làm sao?", answer: "Vui lòng liên hệ số Hotline 1900 xxxx tối thiểu 2 giờ trước giờ hẹn khám để nhân viên hỗ trợ bạn dời lịch hoặc hủy lịch miễn phí." },
            { id: 3, question: "Quy trình đi khám tại bệnh viện như thế nào?", answer: "Khi đến bệnh viện, bạn vui lòng lại quầy tiếp nhận, báo đã đặt lịch qua BookingCare và đọc số điện thoại. Nhân viên sẽ hướng dẫn bạn vào thẳng phòng khám mà không cần lấy số chờ." },
            { id: 4, question: "Chi phí khám bệnh được thanh toán như thế nào?", answer: "Bạn sẽ thanh toán trực tiếp tại quầy thu ngân của Bệnh viện/Phòng khám sau khi khám xong. Giá khám hiển thị trên website là giá niêm yết chính thức." }
        ];

        return (
            <div className="support-page-container">
                <HomeHeader isShowBanner={false} />

                <div className="support-banner">
                    <h1>Trung tâm Hỗ trợ Khách hàng</h1>
                    <p>BookingCare luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn</p>
                </div>

                <div className="support-body">
                    {/* Phần 1: Các kênh liên hệ (Contact Cards) */}
                    <div className="contact-methods">
                        <div className="contact-card">
                            <i className="fas fa-phone-alt"></i>
                            <h3>Hotline Tư vấn</h3>
                            <p>1900 xxxx</p>
                            <span>(Hỗ trợ từ 7h00 - 18h00)</span>
                        </div>
                        <div className="contact-card">
                            <i className="fab fa-facebook-messenger"></i>
                            <h3>Chat trực tuyến</h3>
                            <p>Fanpage BookingCare</p>
                            <span>(Phản hồi trong 5 phút)</span>
                        </div>
                        <div className="contact-card">
                            <i className="fas fa-envelope"></i>
                            <h3>Gửi Email</h3>
                            <p>support@bookingcare.vn</p>
                            <span>(Xử lý trong vòng 24h)</span>
                        </div>
                    </div>

                    {/* Phần 2: Câu hỏi thường gặp (FAQ) */}
                    <div className="faq-section">
                        <h2 className="faq-title">Câu hỏi thường gặp</h2>
                        <div className="faq-list">
                            {faqs.map((item) => {
                                let isOpen = activeFaqId === item.id;
                                return (
                                    <div className={`faq-item ${isOpen ? 'active' : ''}`} key={item.id}>
                                        <div className="faq-question" onClick={() => this.toggleFaq(item.id)}>
                                            <span>{item.question}</span>
                                            <i className={`fas ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                        </div>
                                        {/* Chỉ render câu trả lời nếu đang được active */}
                                        {isOpen &&
                                            <div className="faq-answer">
                                                {item.answer}
                                            </div>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(SupportPage);