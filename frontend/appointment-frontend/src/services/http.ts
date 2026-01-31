import axios from "axios";

export const http = axios.create({
   baseURL: "http://localhost:8080/smart-appointment/api",
   headers: {"Content-Type": "application/json"},
});

let getToken: (() => string | null) | null = null;

export function setTokenGetter(fn: () => string | null){
    getToken = fn;
}

http.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});