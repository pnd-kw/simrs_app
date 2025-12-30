import { axiosPendaftaranInstance } from "../axiosInstance";

// Tipe Antrian
export const getTipeAntrian = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/tipe/antrian?${params}`
  );
  return response.data;
};

export const postTipeAntrian = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/tipe/antrian`,
    payload
  );
  return response.data;
};

export const updateTipeAntrian = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/tipe/antrian`, payload);
  return response.data;
};

// Loket
export const getLoket = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/loket/antrian?${params}`
  );
  return response.data;
};

export const postLoket = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/loket/antrian`,
    payload
  );
  return response.data;
};

export const updateLoket = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/loket/antrian`,
    payload
  );
  return response.data;
};
