import axios from 'axios';

const instance = axios.create({
    // استبدل بـ IP جهاز الكمبيوتر الخاص بك أو رابط الـ API
    baseURL: 'http://192.168.1.11:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default instance;