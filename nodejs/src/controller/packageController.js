import packageService from '../services/packageService';

let createNewPackage = async (req, res) => {
    try {
        let info = await packageService.createNewPackage(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
}

let getAllPackages = async (req, res) => {
    try {
        let info = await packageService.getAllPackages(req.query.type);

        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
}

let editPackage = async (req, res) => {
    try {
        let info = await packageService.editPackage(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}
let getDetailPackageById = async (req, res) => {
    try {
        let info = await packageService.getDetailPackageById(req.query.id);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}
let postBookPackage = async (req, res) => {
    try {
        let info = await packageService.postBookPackage(req.body);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}
module.exports = {
    createNewPackage: createNewPackage,
    getAllPackages: getAllPackages,
    editPackage: editPackage,
    getDetailPackageById: getDetailPackageById,
    postBookPackage: postBookPackage
}