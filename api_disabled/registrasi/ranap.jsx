import { axiosPendaftaranInstance } from "../axiosInstance";

export const getRawatInap = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/registrasi/ranap?${params}`
  );
  return response.data;
};

export const postRawatInap = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/registrasi/ranap`,
    payload
  );
  return response.data;
};

export const updateRawatInap = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/registrasi/ranap`,
    payload
  );
  return response.data;
};

export const deleteRawatInap = async (params) => {
  const response = await axiosPendaftaranInstance.delete(
    `/registrasi/ranap/${params}`
  );
  return response.data;
};