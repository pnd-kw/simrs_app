import { axiosPendaftaranInstance } from "../axiosInstance";

export const getDataDokter = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/rencana/kontrol/dokter/list?${params}`
  );
  return response.data;
};

export const postDataDokter = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/vclaim/rencana/kontrol/dokter/list`,
    payload
  );
  return response.data;
};

export const updateDataDokter = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/vclaim/rencana/kontrol/dokter/list`,
    payload
  );
  return response.data;
};
