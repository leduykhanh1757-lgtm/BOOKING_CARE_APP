const fetch = require('cross-fetch');

let askChatBot = (userMessage) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userMessage) {
                resolve({ errCode: 1, errMessage: 'Missing parameter!' });
                return;
            }

            // 1. Lấy API Key từ .env
            const apiKey = process.env.GEMINI_API_KEY;

            // 2. TRỎ ĐÚNG VÀO TÊN MODEL (gemini-2.5-flash)
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

            // 3. Văn mẫu "nhồi sọ" AI
            const prompt = `Bạn là một trợ lý ảo y tế nhiệt tình của nền tảng BookingCare. Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt. Câu hỏi của bệnh nhân: "${userMessage}"`;

            // 4. Bắn request lên Google bằng Fetch chuẩn
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            // 5. Chờ Google trả kết quả về
            const data = await response.json();

            // Xử lý nếu có lỗi
            if (data.error) {
                console.log("LỖI TỪ GOOGLE API:", data.error.message);
                resolve({ errCode: 2, errMessage: 'AI API Error' });
                return;
            }

            // Bóc tách lớp vỏ JSON lấy câu trả lời
            const botReply = data.candidates[0].content.parts[0].text;

            resolve({
                errCode: 0,
                errMessage: 'Ok',
                botReply: botReply
            });

        } catch (e) {
            console.log("LỖI TRY-CATCH:", e);
            reject(e);
        }
    });
}

module.exports = { askChatBot }