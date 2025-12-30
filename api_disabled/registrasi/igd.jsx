import { axiosPendaftaranInstance } from "../axiosInstance";

export const getListIgd = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/registrasi/ugd?${params}`
  );
  return response.data;
};

export const searchTriage = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/triage?${params}`);
  return response.data;
};

export const createIgd = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    "/registrasi/ugd",
    payload
  );
  return response;
};

export const updateIgd = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    "/registrasi/ugd",
    payload
  );
  return response;
};

export const deleteIgd = async (params) => {
  const response = await axiosPendaftaranInstance.delete(
    `/registrasi/ugd/${params}`
  );
  return response.data;
};

export const printLabelIgd = async (params) => {
  const response = await axiosPendaftaranInstance.post(
    `/cetak/label?id=${params}`
  );
  return response;
};

export const printAntrianIgd = async (params) => {
  const response = await axiosPendaftaranInstance.post(
    `/cetak/tracer?id=${params}`
  );
  return response;
};
