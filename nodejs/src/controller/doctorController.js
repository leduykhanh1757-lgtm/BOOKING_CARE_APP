import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10; // Mặc định lấy 10 bác sĩ
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let postInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(response);
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let getInforDoctorById = async (req, res) => {
    try {
        let doctorId = req.query.id;
        let response = await doctorService.getInforDoctorById(doctorId);
        return res.status(200).json(response);
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let doctorId = req.query.doctorId;
        let date = req.query.date;
        let response = await doctorService.getScheduleByDate(doctorId, date);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getExtraInforDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let getProfileDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let sendRemedy = async (req, res) => {
    try {
        let info = await doctorService.sendRemedy(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
let createNewComment = async (req, res) => {
    try {
        let info = await doctorService.createNewComment(req.body);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}

let getCommentsByDoctorId = async (req, res) => {
    try {
        let info = await doctorService.getCommentsByDoctorId(req.query.doctorId);
        return res.status(200).json(info);
    } catch (e) {
        return res.status(200).json({ errCode: -1, errMessage: 'Error from server' });
    }
}
let toggleLikeDoctor = async (req, res) => {
    try {
        let info = await doctorService.toggleLikeDoctor(req.body);
        return res.status(200).json(info);
    } catch (e) { return res.status(200).json({ errCode: -1, errMessage: 'Error from server' }); }
}

let getLikesByDoctorId = async (req, res) => {
    try {
        let info = await doctorService.getLikesByDoctorId(req.query.doctorId, req.query.patientId);
        return res.status(200).json(info);
    } catch (e) { return res.status(200).json({ errCode: -1, errMessage: 'Error from server' }); }
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctor: postInforDoctor,
    getInforDoctorById: getInforDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    sendRemedy: sendRemedy,
    createNewComment: createNewComment,
    getCommentsByDoctorId: getCommentsByDoctorId,
    toggleLikeDoctor: toggleLikeDoctor,
    getLikesByDoctorId: getLikesByDoctorId
}