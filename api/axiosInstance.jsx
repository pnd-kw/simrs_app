import { tokenSync } from "@/utils/tokenSync";
import axios from "axios";

export const axiosAuthInstance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosInstance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPendaftaranInstance = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAuthInstance.interceptors.request.use(
  (config) => {
    const token = tokenSync.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosAuthInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenSync.broadcastLogout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

axiosPendaftaranInstance.interceptors.request.use(
  (config) => {
    const token = tokenSync.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosPendaftaranInstance.interceptors.request.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenSync.broadcastLogout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
