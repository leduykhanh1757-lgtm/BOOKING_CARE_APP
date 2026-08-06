import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Các route PUBLIC - Ai cũng có thể truy cập mà không cần đăng nhập/token
const nonSecurePaths = [
    '/api/login',
    '/api/forgot-password',
    '/api/verify-forgot-password',
    '/api/top-doctor-home',
    '/api/get-all-doctors',
    '/api/get-infor-doctor-by-id',
    '/api/get-schedule-doctor-by-date',
    '/api/get-extra-infor-doctor-by-id',
    '/api/get-profile-doctor-by-id',
    '/api/patient-book-appointment',
    '/api/verify-book-appointment',
    '/api/get-all-specialty',
    '/api/get-detail-specialty-by-id',
    '/api/get-clinic',
    '/api/get-detail-clinic-by-id',
    '/api/get-all-handbook',
    '/api/get-detail-handbook-by-id',
    '/api/get-comments-by-doctor-id',
    '/api/get-likes-by-doctor-id',
    '/api/ask-chatbot',
    '/api/get-all-packages',
    '/api/get-detail-package-by-id',
    '/api/book-package',
    '/api/allcode',
    '/api/get-private-messages'
];

export const createJWT = (payload) => {
    let key = process.env.JWT_SECRET || 'bookingcare_jwt_secret_key_2026';
    let token = null;
    try {
        token = jwt.sign(payload, key, { expiresIn: '1d' });
    } catch (err) {
        console.error('Error creating JWT:', err);
    }
    return token;
};

export const verifyToken = (token) => {
    let key = process.env.JWT_SECRET || 'bookingcare_jwt_secret_key_2026';
    let decoded = null;
    try {
        decoded = jwt.verify(token, key);
    } catch (err) {
        console.error('JWT verify error:', err.message);
    }
    return decoded;
};

export const checkUserJWT = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    if (nonSecurePaths.includes(req.path)) {
        return next();
    }

    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (token) {
        let decoded = verifyToken(token);
        if (decoded) {
            req.user = decoded;
            return next();
        } else {
            return res.status(401).json({
                errCode: -1,
                errMessage: 'Not authenticated user / Token expired',
                data: ''
            });
        }
    } else {
        return res.status(401).json({
            errCode: -1,
            errMessage: 'Not authenticated user / Missing token',
            data: ''
        });
    }
};

export const checkUserPermission = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                errCode: -1,
                errMessage: 'Not authenticated user',
                data: ''
            });
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.roleId)) {
            return res.status(403).json({
                errCode: -2,
                errMessage: `You don't have permission to access this resource! Required roles: ${allowedRoles.join(', ')}`,
                data: ''
            });
        }

        next();
    };
};
