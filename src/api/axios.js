import axios from 'axios';
import { Config } from '../constants/Config';
const POS_ID = "8e6724e2-efaf-46a0-9e27-aa083b9500c5";
const api = axios.create({
    baseURL: Config.BASE_URL,
    timeout: Config.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-POS-ID': POS_ID
    }
});

export default api;