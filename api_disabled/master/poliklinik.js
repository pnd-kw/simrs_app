import { axiosPendaftaranInstance } from "../axiosInstance";

export const getPoliklinik = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/poliklinik?${params}`);
  return response.data;
};

export const getListPoliklinik = async () => {
  const response = await axiosPendaftaranInstance.get(`/poliklinik/list`);
  return response.data;
};

export const postPoliklinik = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/poliklinik`, payload);
  return response.data;
};

export const updatePoliklinik = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/poliklinik`, payload);
  return response.data;
};

// Poliklinik Spesialis

export const getPoliklinikSpesialis = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/poliklinik/spesialis?${params}`
  );
  return response.data;
};

export const postPoliklinikSpesialis = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/poliklinik/spesialis`,
    payload
  );
  return response.data;
};

export const updatePoliklinikSpesialis = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/poliklinik/spesialis`,
    payload
  );
  return response.data;
};
