import actionTypes from './actionTypes';
import { getAllCodeService } from '../../services/userService';

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
