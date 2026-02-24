import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Config } from "../constants/Config";

const api = axios.create({
    baseURL: Config.BASE_URL,
    timeout: Config.TIMEOUT,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// 🔥 إضافة token و posId تلقائياً
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync("token");
            const userString = await SecureStore.getItemAsync("user");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            if (userString) {
                const user = JSON.parse(userString);

                // إذا posId موجود داخل user
                if (user?.pos_id) {
                    config.headers["X-POS-ID"] = user.pos_id;
                }
            }

            return config;
        } catch (error) {
            return config;
        }
    },
    (error) => Promise.reject(error)
);

export default api;