import { axiosPendaftaranInstance } from "../axiosInstance";

// Asuransi

export const getAsuransi = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/asuransi?${params}`);
  return response.data;
};

export const getTipeAsuransi = async () => {
  const response = await axiosPendaftaranInstance.get(`/tipe/asuransi/list`);
  return response.data;
};

export const postAsuransi = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/asuransi`, payload);
  return response.data;
};

export const updateAsuransi = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/asuransi`, payload);
  return response.data;
};

// Perusahaan

export const getPerusahaan = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/perusahaan?${params}`);
  return response.data;
};

export const getTipePerusahaan = async () => {
  const response = await axiosPendaftaranInstance.get(`/tipe/perusahaan/list`);
  return response.data;
};

export const postPerusahaan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/perusahaan`, payload);
  return response.data;
};

export const updatePerusahaan = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/perusahaan`, payload);
  return response.data;
};

export const getListPerusahaan = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/perusahaan/list`);
  return response.data;
};

