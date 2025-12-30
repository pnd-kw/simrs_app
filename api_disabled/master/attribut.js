import { axiosPendaftaranInstance } from "../axiosInstance";

// Agama
export const getAgama = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/agama?${params}`);
  return response.data;
};

export const getListAgama = async () => {
  const response = await axiosPendaftaranInstance.get(`/agama/list`);
  return response.data;
};

export const postAgama = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/agama`, payload);
  return response.data;
};

export const updateAgama = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/agama`, payload);
  return response.data;
};

// Bank
export const getBank = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/bank?${params}`);
  return response.data;
};

export const getListBank = async () => {
  const response = await axiosPendaftaranInstance.get(`/bank/list`);
  return response.data;
};

export const postBank = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/bank`, payload);
  return response.data;
};

export const updateBank = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/bank`, payload);
  return response.data;
};

// Golongan darah
export const getGolonganDarah = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/goldar?${params}`);
  return response.data;
};

export const getListGolonganDarah = async () => {
  const response = await axiosPendaftaranInstance.get(`/goldar/list`);
  return response.data;
};

export const postGolonganDarah = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/goldar`, payload);
  return response.data;
};

export const updateGolonganDarah = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/goldar`, payload);
  return response.data;
};

// Pendidikan
export const getPendidikan = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/pendidikan?${params}`);
  return response.data;
};

export const getListPendidikan = async () => {
  const response = await axiosPendaftaranInstance.get(`/pendidikan/list`);
  return response.data;
};

export const postPendidikan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/pendidikan`, payload);
  return response.data;
};

export const updatePendidikan = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/pendidikan`, payload);
  return response.data;
};

// Suku bangsa
export const getSukuBangsa = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/suku?${params}`);
  return response.data;
};

export const getListSukuBangsa = async () => {
  const response = await axiosPendaftaranInstance.get(`/suku/list`);
  return response.data;
};

export const postSukuBangsa = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/suku`, payload);
  return response.data;
};

export const updateSukuBangsa = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/suku`, payload);
  return response.data;
};

// Penanggung jawab
export const getPenaggungJawab = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/penanggung-jawab?${params}`
  );
  return response.data;
};

export const getListPenaggungJawab = async () => {
  const response = await axiosPendaftaranInstance.get(`/penanggung-jawab/list`);
  return response.data;
};

export const postPenaggungJawab = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/penanggung-jawab`,
    payload
  );
  return response.data;
};

export const updatePenaggungJawab = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/penanggung-jawab`,
    payload
  );
  return response.data;
};

// Pekerjaan
export const getPekerjaan = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/pekerjaan?${params}`);
  return response.data;
};

export const getListPekerjaan = async () => {
  const response = await axiosPendaftaranInstance.get(`/pekerjaan/list`);
  return response.data;
};

export const postPekerjaan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/pekerjaan`, payload);
  return response.data;
};

export const updatePekerjaan = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/pekerjaan`, payload);
  return response.data;
};
