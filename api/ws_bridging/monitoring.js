import { axiosPendaftaranInstance } from "../axiosInstance";

export const getDataKunjungan = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/monitoring/kunjungan?${params}`
  );
  return response.data;
};

export const postDataKunjungan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/vclaim/monitoring/kunjungan`,
    payload
  );
  return response.data;
};

export const updateDataKunjungan = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/vclaim/monitoring/kunjungan`,
    payload
  );
  return response.data;
};

export const getDataKlaim = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/monitoring/klaim?${params}`
  );
  return response.data;
};

export const postDataKlaim = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/vclaim/monitoring/klaim`,
    payload
  );
  return response.data;
};

export const updateDataKlaim = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/vclaim/monitoring/klaim`,
    payload
  );
  return response.data;
};

export const getDataPelayanan = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/monitoring/history/pelayanan/peserta?${params}`
  );
  return response.data;
};

export const postDataPelayanan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/vclaim/monitoring/history/pelayanan/peserta`,
    payload
  );
  return response.data;
};

export const updateDataPelayanan = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/vclaim/monitoring/history/pelayanan/peserta`,
    payload
  );
  return response.data;

};
export const getDataJaminan = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/monitoring/klaim/jaminan/jasaraharja?${params}`
  );
  return response.data;
};

export const postDataJaminan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/vclaim/monitoring/klaim/jaminan/jasaraharja`,
    payload
  );
  return response.data;
};

export const updateDataJaminan = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/vclaim/monitoring/klaim/jaminan/jasaraharja`,
    payload
  );
  return response.data;
};
