import axios from 'axios';
const BASE_URL = 'http://192.168.1.11:8000';
const instance = axios.create({
    // استبدل بـ IP جهاز الكمبيوتر الخاص بك أو رابط الـ API

    baseURL: `${BASE_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});
export const STORAGE_URL = `${BASE_URL}/storage/`;
export default instance;