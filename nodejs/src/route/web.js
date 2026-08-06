import express from 'express';
import userController from '../controller/userController';
import doctorController from '../controller/doctorController';
import patientController from '../controller/patientController';
import specialtyController from '../controller/specialtyController';
import clinicController from "../controller/clinicController";
import handbookController from '../controller/handbookController';
import packageController from "../controller/packageController";
import { checkUserJWT, checkUserPermission } from '../middleware/JWTAction';

let router = express.Router();

let initWebRoute = (app) => {
    // Áp dụng middleware kiểm tra JWT cho toàn bộ các route
    router.use(checkUserJWT);

    // --- PUBLIC ROUTES (Ai cũng truy cập được) ---
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.getAllUsers);
    router.get('/api/allcode', userController.getAllCode);
    router.post('/api/forgot-password', userController.handleForgotPassword);
    router.post('/api/verify-forgot-password', userController.handleVerifyForgotPassword);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.get('/api/get-infor-doctor-by-id', doctorController.getInforDoctorById);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);

    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    router.get('/api/get-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);

    router.get('/api/get-all-handbook', handbookController.getAllHandbook);
    router.get('/api/get-detail-handbook-by-id', handbookController.getDetailHandbookById);

    router.post('/api/create-new-comment', doctorController.createNewComment);
    router.get('/api/get-comments-by-doctor-id', doctorController.getCommentsByDoctorId);
    router.post('/api/toggle-like-doctor', doctorController.toggleLikeDoctor);
    router.get('/api/get-likes-by-doctor-id', doctorController.getLikesByDoctorId);

    router.post('/api/send-private-message', doctorController.postPrivateMessage);
    router.get('/api/get-private-messages', doctorController.getPrivateMessages);

    router.post('/api/ask-chatbot', userController.handleAskBot);

    router.get('/api/get-all-packages', packageController.getAllPackages);
    router.get('/api/get-detail-package-by-id', packageController.getDetailPackageById);
    router.post('/api/book-package', packageController.postBookPackage);

    // --- PROTECTED ROUTES (Cần Token & Phân quyền) ---

    // 1. Quản lý Người dùng (User Management)
    router.post('/api/create-new-user', checkUserPermission(['R1']), userController.createANewUser);
    router.put('/api/edit-user', checkUserPermission(['R1', 'R2', 'R3']), userController.editUser);
    router.delete('/api/delete-user', checkUserPermission(['R1']), userController.deleteUser);

    // 2. Quản lý Bác sĩ & Lịch khám (Doctor & Schedule Management)
    router.post('/api/save-infor-doctors', checkUserPermission(['R1', 'R2']), doctorController.postInforDoctor);
    router.post('/api/bulk-create-schedule', checkUserPermission(['R1', 'R2']), doctorController.bulkCreateSchedule);
    router.get('/api/get-list-patient-for-doctor', checkUserPermission(['R1', 'R2']), patientController.getListPatientForDoctor);
    router.post('/api/send-remedy', checkUserPermission(['R1', 'R2']), doctorController.sendRemedy);

    // 3. Quản lý Chuyên khoa, Phòng khám, Cẩm nang & Gói khám (Admin Management)
    router.post('/api/create-new-specialty', checkUserPermission(['R1']), specialtyController.createSpecialty);
    router.put('/api/edit-specialty', checkUserPermission(['R1']), specialtyController.editSpecialty);

    router.post('/api/create-new-clinic', checkUserPermission(['R1']), clinicController.createClinic);
    router.put('/api/edit-clinic', checkUserPermission(['R1']), clinicController.editClinic);

    router.post('/api/create-new-handbook', checkUserPermission(['R1']), handbookController.createHandbook);
    router.put('/api/edit-handbook', checkUserPermission(['R1']), handbookController.editHandbook);

    router.post('/api/create-new-package', checkUserPermission(['R1']), packageController.createNewPackage);
    router.put('/api/edit-package', checkUserPermission(['R1']), packageController.editPackage);

    router.post('/api/test-send-email', userController.handleTestSendEmail);
    router.get('/api/test-send-email', userController.handleTestSendEmail);

    return app.use('/', router);
}

module.exports = initWebRoute;
