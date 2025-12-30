import { axiosPendaftaranInstance } from "../axiosInstance";

export const spesialis = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/spesialis?${params}`);
  return response.data;
};

export const getListSpesialis = async () => {
  const response = await axiosPendaftaranInstance.get(`/spesialis/list`);
  return response.data;
};

export const kodeBridgePoliklinik = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/ws/bpjs/referensi/poli?${params}`
  );
  return response.data;
};

export const postSpesialis = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/spesialis`, payload);
  return response.data;
};
