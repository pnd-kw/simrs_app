import { axiosPendaftaranInstance } from "../axiosInstance";

export const getProfileRekamMedis = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/pasien?${params}`);
  return response.data;
};

export const postProfileRekamMedis = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/pasien`, payload);
  return response.data;
};

export const updateProfileRekamMedis = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/pasien`, payload);
  return response.data;
};

export const deleteeProfileRekamMedis = async (params) => {
  const response = await axiosPendaftaranInstance.delete(`/pasien/${params}`);
  return response.data;
};
