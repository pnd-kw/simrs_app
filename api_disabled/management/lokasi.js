import { axiosPendaftaranInstance } from "../axiosInstance";

// Negara

export const getNegara = async () => {
  const response = await axiosPendaftaranInstance.get(`/negara/list`);
  return response.data;
};

export const postNegara = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/negara/list`, payload);
  return response.data;
};

export const updateNegara = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/negara/list`, payload);
  return response.data;
};

// Provinsi

export const getProvinsi = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/provinsi/list?ms_locnegara_code=${params}`
  );
  return response.data;
};

export const postProvinsi = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/provinsi/list`,
    payload
  );
  return response.data;
};

export const updateProvinsi = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/provinsi/list`,
    payload
  );
  return response.data;
};

// Kabupaten / Kota

export const getKabupaten = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/kabupaten/list?ms_locpropinsi_id=${params}`
  );
  return response.data;
};

export const postKabupaten = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/kabupaten/list`,
    payload
  );
  return response.data;
};

export const updateKabupaten = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/kabupaten/list`,
    payload
  );
  return response.data;
};

// Kecamatan

export const getKecamatan = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/kecamatan/list?ms_lockota_id=${params}`
  );
  return response.data;
};

export const postKecamatan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/kecamatan/list`,
    payload
  );
  return response.data;
};

export const updateKecamatan = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/kecamatan/list`,
    payload
  );
  return response.data;
};

// Kelurahan

export const getKelurahan = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/kelurahan/list?ms_lockecamatan_id=${params}`
  );
  return response.data;
};

export const postKelurahan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/kelurahan/list`,
    payload
  );
  return response.data;
};

export const updateKelurahan = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/kelurahan/list`,
    payload
  );
  return response.data;
};
