import express from 'express';
import homeController from '../controller/homeController';
let router = express.Router();

let initWebRoute = (app) => {
    router.get('/', homeController.gethomePage);
    router.get('/about', homeController.getAboutPage);
    return app.use('/', router);
}

module.exports = initWebRoute;
