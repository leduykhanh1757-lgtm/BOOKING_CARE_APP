import axios from 'axios';
import _ from 'lodash';

let backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
if (backendUrl && !backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
    backendUrl = `https://${backendUrl}`;
}

const instance = axios.create({
    baseURL: backendUrl,
});
console.log("Check baseURL:", backendUrl);
instance.interceptors.response.use(
    (response) => {
        // Thrown error for request with OK status code
        const { data } = response;
        return response.data;
    }
);

export default instance;
