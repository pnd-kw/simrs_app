import { axiosPendaftaranInstance } from "../axiosInstance";

export const getMasterJenisHarga = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/jenis/harga?${params}`);
  return response.data;
};

export const getMasterJenisHargaList = async () => {
  const response = await axiosPendaftaranInstance.get(`/jenis/harga/list`);
  return response.data;
};

export const postMasterJenisHarga = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/jenis/harga`, payload);
  return response.data;
};

export const updateMasterJenisHarga = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/jenis/harga`, payload);
  return response.data;
};
