import { axiosPendaftaranInstance } from "../axiosInstance";

export const searchPasien = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/pasien?${params}`);
  return response.data;
};
