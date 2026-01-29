import axios from 'axios';
import { Config } from '../constants/Config';

const api = axios.create({
    baseURL: Config.BASE_URL,
    timeout: Config.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;