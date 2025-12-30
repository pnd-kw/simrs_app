import { axiosPendaftaranInstance } from "../axiosInstance";

// Layanan

export const getLayanan = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/layanan?${params}`);
  return response.data;
};

export const getListLayanan = async () => {
  const response = await axiosPendaftaranInstance.get(`/layanan/list`);
  return response.data;
};

export const postLayanan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/layanan`, payload);
  return response.data;
};

export const updateLayanan = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/layanan`, payload);
  return response.data;
};

// Ruang Layanan

export const getRuangLayanan = async (query) => {
  const response = await axiosPendaftaranInstance.get(`/layanan/ruang?${query}`);
  return response.data;
};

export const postRuangLayanan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/layanan/ruang`,
    payload
  );
  return response.data;
};

export const updateRuangLayanan = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/layanan/ruang`,
    payload
  );
  return response.data;
};

// Jenis Rawat

export const getJenisRawat = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/jenis/rawat?${params}`);
  return response.data;
};

export const postJenisRawat = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/jenis/rawat`, payload);
  return response.data;
};

export const updateJenisRawat = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/jenis/rawat`, payload);
  return response.data;
};

export const getJenisLayanan = async () => {
  const response = await axiosPendaftaranInstance.get("/jenis/layanan");
  return response.data
};
