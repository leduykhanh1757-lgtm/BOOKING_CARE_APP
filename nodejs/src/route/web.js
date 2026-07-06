import express from 'express';
import homeController from '../controller/homeController';
import userController from '../controller/userController';
import doctorController from '../controller/doctorController';
import patientController from '../controller/patientController';
import specialtyController from '../controller/specialtyController';
import clinicController from "../controller/clinicController";
import handbookController from '../controller/handbookController';
import packageController from "../controller/packageController";
let router = express.Router();

let initWebRoute = (app) => {
    router.get('/', homeController.gethomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.PostCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.getAllUsers);
    router.post('/api/create-new-user', userController.createANewUser);
    router.put('/api/edit-user', userController.editUser);
    router.delete('/api/delete-user', userController.deleteUser);
    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-infor-doctors', doctorController.postInforDoctor);
    router.get('/api/get-infor-doctor-by-id', doctorController.getInforDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);
    router.put('/api/edit-clinic', clinicController.editClinic);
    router.put('/api/edit-specialty', specialtyController.editSpecialty);
    router.get('/api/get-list-patient-for-doctor', patientController.getListPatientForDoctor);
    router.post('/api/send-remedy', doctorController.sendRemedy);

    router.post('/api/create-new-handbook', handbookController.createHandbook);
    router.get('/api/get-all-handbook', handbookController.getAllHandbook);
    router.put('/api/edit-handbook', handbookController.editHandbook);
    router.get('/api/get-detail-handbook-by-id', handbookController.getDetailHandbookById);

    router.post('/api/create-new-comment', doctorController.createNewComment);
    router.get('/api/get-comments-by-doctor-id', doctorController.getCommentsByDoctorId);
    router.post('/api/toggle-like-doctor', doctorController.toggleLikeDoctor);
    router.get('/api/get-likes-by-doctor-id', doctorController.getLikesByDoctorId);

    router.post('/api/ask-chatbot', userController.handleAskBot);

    router.post('/api/create-new-package', packageController.createNewPackage);
    router.get('/api/get-all-packages', packageController.getAllPackages);
    router.put('/api/edit-package', packageController.editPackage);
    router.get('/api/get-detail-package-by-id', packageController.getDetailPackageById);
    router.post('/api/book-package', packageController.postBookPackage);


    return app.use('/', router);
}

module.exports = initWebRoute;
