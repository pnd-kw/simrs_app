import { axiosPendaftaranInstance } from "../axiosInstance";

export const getDataBPJS = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/peserta/nokartu?${params}`
  );
  return response.data;
};

export const postDataBPJS = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/vclaim/peserta/nokartu`,
    payload
  );
  return response.data;
};

export const updateDataBPJS = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/vclaim/peserta/nokartu`,
    payload
  );
  return response.data;
};

export const getDataNIK = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/peserta/nik?${params}`
  );
  return response.data;
};

export const postDataNIK = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/vclaim/peserta/nik`,
    payload
  );
  return response.data;
};

export const updateDataNIK = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/vclaim/peserta/nik`,
    payload
  );
  return response.data;
};