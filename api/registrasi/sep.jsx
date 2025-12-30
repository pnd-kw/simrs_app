import { axiosPendaftaranInstance } from "../axiosInstance";

export const getSepHistory = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/sep/history?${params}`
  );
  return response.data;
};

export const getSepPeserta = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/peserta?${params}`
  );
  return response.data;
};

export const getSepDetail = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/rujukan/nokartu?${params}`
  );
  return response.data;
};

export const getSepBySep = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/sep?no_sep=${params}`
  );
  return response.data;
};

export const getSepRencanaKontrol = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/rencana/kontrol/sep?no_sep=${params}`
  );
  return response.data;
};

export const getListDiagnosa = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/referensi/diagnosa?search=${params}`
  );
  return response.data;
};

export const createSep = async (payload) => {
  const response = await axiosPendaftaranInstance.post("/vclaim/sep", payload);
  return response;
};

export const cetakSep = async (params) => {
  const response = await axiosPendaftaranInstance.post(
    `/cetak/sep?no_sep=${params}`,
    {},
    { responseType: "blob" }
  );
  return response;
};
