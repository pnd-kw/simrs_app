import { axiosPendaftaranInstance } from "../axiosInstance";

export const getDokter = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/dokter?${params}`);
  return response.data;
};

export const getListDokter = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/dokter/list?${params}`);
  return response.data;
};

export const postDokter = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/dokter`, payload);
  return response.data;
};

export const updateDokter = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/dokter`, payload);
  return response.data;
};
