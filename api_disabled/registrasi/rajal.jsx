import { axiosPendaftaranInstance } from "../axiosInstance";

export const getPeserta = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/peserta/nokartu?no_kartu=${params}`
  );
  return response.data;
};

export const getListRajal = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `registrasi/rajal?${params}`
  );
  return response.data;
};

export const createRajal = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    "/registrasi/rajal",
    payload
  );
  return response;
};

export const updateRajal = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    "/registrasi/rajal",
    payload
  );
  return response;
};

export const deleteRajal = async (params) => {
  const response = await axiosPendaftaranInstance.delete(
    `/registrasi/rajal/${params}`
  );
  return response.data;
};

export const getDataAntrian = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/registrasi/rajal/antrian/bpjs?${params}`
  );
  return response.data;
};

export const updateDataAntrian = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    "/registrasi/rajal/antrian/bpjs",
    payload
  );
  return response;
};

export const printLabelRajal = async (params) => {
  const response = await axiosPendaftaranInstance.post(
    `/cetak/label?id=${params}`
  );
  return response;
};

export const printAntrianRajal = async (params) => {
  const response = await axiosPendaftaranInstance.post(
    `/cetak/tracer?id=${params}`
  );
  return response;
};
