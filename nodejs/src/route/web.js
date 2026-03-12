import express from 'express';
import homeController from '../controller/homeController';
import userController from '../controller/userController';
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

    return app.use('/', router);
}

module.exports = initWebRoute;
