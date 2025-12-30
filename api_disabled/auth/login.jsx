import { axiosAuthInstance } from "../axiosInstance";

export const login = async (credentials) => {
  const response = await axiosAuthInstance.post("/user/login", credentials);
  return response.data;
};

export const loginSanctum = async (credentials) => {
  const response = await axiosAuthInstance.post("/api/auth/login", credentials);
  return response.data;
};

export const loginAplikasi = async (app_code, role_code) => {
  const response = await axiosAuthInstance.post("/api/login/app", {
    app_code,
    role_code,
  });
  return response.data;
};

export const loginListMenu = async () => {
  const response = await axiosAuthInstance.get(
    `/simrs/menu/sidelist?is_function=false`
  );
  return response.data;
};
