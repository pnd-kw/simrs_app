import { axiosPendaftaranInstance } from "../axiosInstance";

export const getTipeRegistrasi = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/tipe/registrasi?${params}`
  );
  return response.data;
};

export const getKelasKunjungan = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/kelas/kunjungan?${params}`
  );
  return response.data;
};


export const postKelasKunjungan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/kelas/kunjungan`,
    payload
  );
  return response.data;
};

export const updateKelasKunjungan = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/kelas/kunjungan`,
    payload
  );
  return response.data;
};

export const getTarif = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/tarif?${params}`
  );
  return response.data;
};
