// Lưu trữ toàn bộ Text, Banner, Icon của các dịch vụ để Template tự động gọi ra
export const SERVICE_CONFIG = {
    'general': {
        title: "Khám Sức khỏe Tổng quát",
        desc: "Dịch vụ khám và tầm soát sức khỏe toàn diện cho cá nhân và gia đình.",
        bannerBg: "linear-gradient(to right, rgba(34, 72, 189, 0.9), rgba(69, 195, 210, 0.7))",
        features: [
            { icon: "fas fa-heartbeat", title: "Khám toàn diện", text: "Kiểm tra tổng quát các chỉ số sức khỏe cơ bản." },
            { icon: "fas fa-user-md", title: "Bác sĩ giàu kinh nghiệm", text: "Được tư vấn bởi các chuyên gia y tế uy tín." },
            { icon: "fas fa-check-circle", title: "Kết quả nhanh chóng", text: "Quy trình khép kín, nhận kết quả trong ngày." }
        ]
    },
    // 1. Tiêm chủng y tế
    'vaccination': {
        title: "Dịch vụ Tiêm chủng Y tế",
        desc: "Đặt lịch tiêm chủng nhanh chóng, vắc xin chính hãng, không lo chờ đợi.",
        bannerBg: "linear-gradient(to right, rgba(34, 72, 189, 0.9), rgba(69, 195, 210, 0.7))",
        features: [
            { icon: "fas fa-shield-alt", title: "Vắc xin chính hãng", text: "100% vắc xin nhập khẩu, bảo quản chuẩn GSP." },
            { icon: "fas fa-user-md", title: "Bác sĩ chuyên khoa", text: "Khám sàng lọc kỹ lưỡng trước tiêm để đảm bảo an toàn." },
            { icon: "fas fa-clock", title: "Không lo chờ đợi", text: "Đặt lịch trước qua hệ thống, ưu tiên tiếp đón ngay lập tức." }
        ]
    },

    // 2. Khám từ xa
    'remote-examination': {
        title: "Dịch vụ Khám từ xa (Telemedicine)",
        desc: "Kết nối trực tuyến với bác sĩ chuyên khoa qua Video Call mọi lúc, mọi nơi.",
        bannerBg: "linear-gradient(to right, rgba(34, 72, 189, 0.9), rgba(69, 195, 210, 0.7))",
        features: [
            { icon: "fas fa-video", title: "Video Call sắc nét", text: "Trải nghiệm khám bệnh trực tuyến mượt mà, rõ ràng như gặp trực tiếp." },
            { icon: "fas fa-user-md", title: "Bác sĩ tuyến trung ương", text: "Đội ngũ chuyên gia từ các bệnh viện lớn hàng đầu." },
            { icon: "fas fa-medkit", title: "Giao thuốc tận nhà", text: "Kê đơn điện tử và hỗ trợ giao thuốc nhanh chóng đến tận cửa." }
        ]
    },

    // 3. Vật lý trị liệu
    'physiotherapy': {
        title: "Vật lý trị liệu & Phục hồi chức năng",
        desc: "Đội ngũ chuyên gia giàu kinh nghiệm, hệ thống máy móc hiện đại.",
        bannerBg: "linear-gradient(to right, rgba(34, 72, 189, 0.9), rgba(69, 195, 210, 0.7))",
        features: [
            { icon: "fas fa-wheelchair", title: "Cơ xương khớp", text: "Phục hồi chức năng hiệu quả sau chấn thương, phẫu thuật." },
            { icon: "fas fa-heartbeat", title: "Chuyên gia hàng đầu", text: "Kỹ thuật viên được đào tạo bài bản, thao tác chuyên sâu." },
            { icon: "fas fa-bed", title: "Trang thiết bị", text: "Hệ thống máy móc trị liệu nhập khẩu trực tiếp từ châu Âu và Mỹ." }
        ]
    },

    // 4. Xét nghiệm y học
    'medical-test': {
        title: "Xét nghiệm Y học",
        desc: "Dịch vụ lấy mẫu xét nghiệm tận nơi hoặc tại phòng khám, kết quả nhanh chóng, chính xác.",
        bannerBg: "linear-gradient(to right, rgba(34, 72, 189, 0.9), rgba(69, 195, 210, 0.7))",
        features: [
            { icon: "fas fa-motorcycle", title: "Lấy mẫu tại nhà", text: "Tiết kiệm thời gian di chuyển, an toàn và cực kỳ tiện lợi." },
            { icon: "fas fa-flask", title: "Công nghệ tiên tiến", text: "Hệ thống phòng lab đạt chuẩn ISO 15189:2012." },
            { icon: "fas fa-file-medical-alt", title: "Trả kết quả online", text: "Tra cứu kết quả xét nghiệm bảo mật ngay trên ứng dụng." }
        ]
    },

    // 5. Sức khỏe tinh thần
    'mental-health': {
        title: "Tư vấn Sức khỏe Tinh thần",
        desc: "Lắng nghe, chia sẻ và đồng hành cùng bạn vượt qua những rào cản tâm lý.",
        bannerBg: "linear-gradient(to right, rgba(34, 72, 189, 0.9), rgba(69, 195, 210, 0.7))",
        features: [
            { icon: "fas fa-user-shield", title: "Bảo mật tuyệt đối", text: "Mọi thông tin cuộc gọi và hồ sơ tư vấn đều được mã hóa." },
            { icon: "fas fa-user-md", title: "Chuyên gia tâm lý", text: "Đội ngũ chuyên gia, bác sĩ tâm thần học giàu sự thấu cảm." },
            { icon: "fas fa-couch", title: "Không gian riêng tư", text: "Thoải mái chia sẻ vấn đề cá nhân mà không lo ngại rào cản." }
        ]
    },

    // 6. Khám nha khoa
    'dental-examination': {
        title: "Dịch vụ Khám Nha khoa",
        desc: "Chăm sóc răng miệng toàn diện, mang lại nụ cười tự tin và rạng rỡ.",
        bannerBg: "linear-gradient(to right, rgba(34, 72, 189, 0.9), rgba(69, 195, 210, 0.7))",
        features: [
            { icon: "fas fa-smile", title: "Nha khoa thẩm mỹ", text: "Dịch vụ bọc răng sứ, niềng răng trong suốt, tẩy trắng răng." },
            { icon: "fas fa-x-ray", title: "Công nghệ cao", text: "Trang bị máy quét dấu răng iTero, chụp X-quang CT Conebeam 3D." },
            { icon: "fas fa-check-circle", title: "Vô trùng tuyệt đối", text: "Quy trình chống nhiễm khuẩn khép kín chuẩn Bộ Y tế." }
        ]
    }
};