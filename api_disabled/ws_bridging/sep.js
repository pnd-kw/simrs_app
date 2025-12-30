import { axiosPendaftaranInstance } from "../axiosInstance";

export const getSepBridging = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/vclaim/sep?${params}`);
  return response.data;
};

export const postSepBridging = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/vclaim/sep`, payload);
  return response.data;
};

export const updateSepBridging = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/vclaim/sep`, payload);
  return response.data;
};

export const getCariSepRencanaKontrol = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/rencana/kontrol/sep?${params}`
  );
  return response.data;
};

export const postCariSepRencanaKontrol = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/vclaim/rencana/kontrol/sep`,
    payload
  );
  return response.data;
};

export const updateCariSepRencanaKontrol = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/vclaim/rencana/kontrol/sep`,
    payload
  );
  return response.data;
};
