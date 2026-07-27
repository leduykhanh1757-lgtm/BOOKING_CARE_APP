const fetch = require('cross-fetch');

let askChatBot = (userMessage) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userMessage) {
                resolve({ errCode: 1, errMessage: 'Missing parameter!' });
                return;
            }

            // 1. Lấy API Key từ .env hoặc Railway
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
                resolve({
                    errCode: 2,
                    errMessage: 'Chưa cài đặt biến môi trường GEMINI_API_KEY trên Railway!'
                });
                return;
            }

            // 2. Danh sách model chuẩn của Google Gemini API
            const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
            const prompt = `Bạn là một trợ lý ảo y tế nhiệt tình của nền tảng BookingCare. Hãy trả lời ngắn gọn, thân thiện bằng tiếng Việt. Câu hỏi của bệnh nhân: "${userMessage}"`;

            let lastError = null;

            for (let model of models) {
                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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

                    const data = await response.json();

                    if (!data.error && data.candidates && data.candidates[0] && data.candidates[0].content) {
                        const botReply = data.candidates[0].content.parts[0].text;
                        resolve({
                            errCode: 0,
                            errMessage: 'Ok',
                            botReply: botReply
                        });
                        return;
                    }

                    if (data.error) {
                        lastError = data.error.message;
                        console.log(`Lỗi Model ${model}:`, data.error.message);
                    }
                } catch (err) {
                    lastError = err.message;
                }
            }

            resolve({
                errCode: 2,
                errMessage: `Google AI Error: ${lastError || 'Không thể lấy phản hồi từ AI'}`
            });

        } catch (e) {
            console.log("LỖI TRY-CATCH CHATBOT:", e);
            reject(e);
        }
    });
}

module.exports = { askChatBot };