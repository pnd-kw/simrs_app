import { axiosPendaftaranInstance } from "../axiosInstance";

export const getMultiRecordPcare = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/rujukan/list/nokartu?${params}`
  );
  return response.data;
};

export const postMultiRecordPcare = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/vclaim/rujukan/list/nokartu`,
    payload
  );
  return response.data;
};

export const updateMultiRecordPcare = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/vclaim/rujukan/list/nokartu`,
    payload
  );
  return response.data;
};

export const getKeluarRs = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/rujukan/keluar/rs?${params}`
  );
  return response.data;
};

export const postKeluarRs = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/vclaim/rujukan/keluar/rs`,
    payload
  );
  return response.data;
};

export const updateKeluarRs = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/vclaim/rujukan/keluar/rs`,
    payload
  );
  return response.data;
};
