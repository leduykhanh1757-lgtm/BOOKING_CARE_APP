import actionTypes from './actionTypes';
import {
    getAllCodeService, createNewUserService, getAllUsers,
    deleteUserService, editUserService, getTopDoctorHomeService,
    getAllDoctorsService, saveDetailDoctorService
} from '../../services/userService';
import { toast } from 'react-toastify';
//gender
export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            // Có thể dispatch một action báo hiệu đang load ở đây (tùy chọn)
            dispatch({ type: actionTypes.FETCH_GENDER_START });

            // Gọi API lấy dữ liệu giới tính
            let res = await getAllCodeService("GENDER");

            if (res && res.errCode === 0) {
                // THÀNH CÔNG: Chuyền dữ liệu (res.data) cho hàm Success
                dispatch(fetchGenderSuccess(res.data));
            } else {
                // LỖI TỪ SERVER
                dispatch(fetchGenderFail());
            }
        } catch (e) {
            // THẤT BẠI (Do rớt mạng, sập nguồn...)
            dispatch(fetchGenderFail());
            console.log('fetchGenderStart error', e);
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFail = () => ({
    type: actionTypes.FETCH_GENDER_FAIL
})

//position
export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_POSITION_START });
            let res = await getAllCodeService("POSITION"); // Gọi xuống API với type là POSITION

            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFail());
            }
        } catch (e) {
            dispatch(fetchPositionFail());
            console.log('fetchPositionStart error', e);
        }
    }
}

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFail = () => ({
    type: actionTypes.FETCH_POSITION_FAIL
})

//Role

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ROLE_START });
            let res = await getAllCodeService("ROLE"); // Gọi xuống API với type là ROLE

            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFail());
            }
        } catch (e) {
            dispatch(fetchRoleFail());
            console.log('fetchRoleStart error', e);
        }
    }
}

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFail = () => ({
    type: actionTypes.FETCH_ROLE_FAIL
})

// create user
export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            // Gọi API ném cục data xuống Backend
            let res = await createNewUserService(data);

            if (res && res.errCode === 0) {
                // Nếu Backend báo lưu thành công (errCode === 0)
                toast.success("Thêm mới người dùng thành công!");
                dispatch(saveUserSuccess());
                dispatch(fetchAllUser()); // Sau khi tạo mới thành công, gọi API lấy lại danh sách user mới nhất
            } else {
                // Backend báo lỗi 
                toast.error("Thêm mới người dùng thất bại!");
                dispatch(saveUserFailed());
            }
        } catch (e) {
            toast.error("Lỗi Server: Không thể thêm người dùng!");
            // Rớt mạng, server chết...
            dispatch(saveUserFailed());
            console.log('saveUserFailed error', e);
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAIL
})

// Fetch all user
export const fetchAllUser = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers("All");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUserSuccess(res.users.reverse()));
            } else {
                dispatch(fetchAllUserFail());
            }
        } catch (e) {
            dispatch(fetchAllUserFail());
            console.log('fetchAllUser error', e);
        }
    }
}

export const fetchAllUserSuccess = (userData) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    data: userData
})

export const fetchAllUserFail = () => ({
    type: actionTypes.FETCH_ALL_USER_FAIL
})

// delete user
export const deleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success("Xóa người dùng thành công!");
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUser());
            } else {
                toast.error("Xóa người dùng thất bại!");
                dispatch(deleteUserFailed());
            }
        } catch (e) {
            toast.error("Lỗi Server: Không thể xóa người dùng!");
            dispatch(deleteUserFailed());
            console.log('deleteUser error', e);
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAIL
})

// Edit user
export const editUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Cập nhật người dùng thành công!");
                dispatch(editUserSuccess());
                dispatch(fetchAllUser());
            } else {
                toast.error("Cập nhật người dùng thất bại!");
                dispatch(editUserFailed());
            }
        } catch (e) {
            toast.error("Lỗi Server: Không thể cập nhật người dùng!");
            dispatch(editUserFailed());
            console.log('editUser error', e);
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAIL
})

// Fetch top doctor
export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService('');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors: res.data
                });
            }
            else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAIL
                });
            }
        } catch (e) {
            console.log('fetchTopDoctor error', e);
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAIL
            });
        }
    }
}

export const fetchTopDoctorSuccess = (data) => ({
    type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
    data: data
})

export const fetchTopDoctorFailed = () => ({
    type: actionTypes.FETCH_TOP_DOCTOR_FAIL
})

// Fetch all doctor
export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctorsService();
            if (res && res.errCode === 0) {
                dispatch(fetchAllDoctorsSuccess(res.data));
            }
            else {
                dispatch(fetchAllDoctorsFailed());
            }
        } catch (e) {
            console.log('fetchAllDoctors error', e);
            dispatch(fetchAllDoctorsFailed());
        }
    }
}

export const fetchAllDoctorsSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
    data: data
})

export const fetchAllDoctorsFailed = () => ({
    type: actionTypes.FETCH_ALL_DOCTORS_FAIL
})

// Save detail doctor

export const saveDetailDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorService(data);
            if (res && res.errCode === 0) {
                toast.success("Lưu thông tin chi tiết bác sĩ thành công!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS
                });
            } else {
                toast.error("Lỗi khi lưu thông tin bác sĩ!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAIL
                });
            }
        } catch (e) {
            toast.error("Lỗi Server: Không thể lưu thông tin!");
            console.log('SAVE_DETAIL_DOCTOR_FAILED', e);
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTOR_FAIL
            });
        }
    }
}

