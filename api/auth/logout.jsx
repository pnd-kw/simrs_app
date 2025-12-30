import { axiosAuthInstance } from "../axiosInstance";

export const logoutUser = async () => {
  const response = await axiosAuthInstance.post("/user/logout");
  return response.data;
};