import { axiosPendaftaranInstance } from "../axiosInstance";

export const getNoKontrol = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/rencana/kontrol/nokartu?${params}`
  );
  return response.data;
};

export const getListNoKontrol = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/rencana/kontrol/list?${params}`
  );
  return response.data;
};

export const createNoKontrol = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/vclaim/rencana/kontrol`,
    payload
  );
  return response;
};

export const deleteNoKontrol = async (params) => {
  const response = await axiosPendaftaranInstance.delete(
    `/vclaim/rencana/kontrol?noSuratKontrol=${params}`
  );

  return response;
};
