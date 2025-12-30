import { axiosPendaftaranInstance } from "../axiosInstance";

// Bed

export const getBed = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/bed?${params}`);
  return response.data;
};

export const postBed = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/bed`, payload);
  return response.data;
};

export const updateBed = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/bed`, payload);
  return response.data;
};

export const getListBed = async () => {
  const response = await axiosPendaftaranInstance.get(`/bed/list`);
  return response.data;
};
// Kelas Kamar

export const getKelasKamar = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/kelas/kamar?${params}`);
  return response.data;
};

export const postKelasKamar = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/kelas/kamar`, payload);
  return response.data;
};

export const updateKelasKamar = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/kelas/kamar`, payload);
  return response.data;
};

// Ruang

export const getRuang = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/ruangan?${params}`);
  return response.data;
};

export const getRuangList = async () => {
  const response = await axiosPendaftaranInstance.get(`/ruangan/list`);
  return response.data;
};

export const postRuang = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/ruangan`, payload);
  return response.data;
};

export const updateRuang = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/ruangan`, payload);
  return response.data;
};

// List

export const getKelasKamarList = async () => {
  const response = await axiosPendaftaranInstance.get(`/kelas/kamar/list`);
  return response.data;
};

export const getKelasKamarRsOnline = async () => {
  const response = await axiosPendaftaranInstance.get(
    `/kelas/kamar/rs/online/list`
  );
  return response.data;
};

export const getRuangAplicars = async () => {
  const response = await axiosPendaftaranInstance.get(`/ruangan-aplicare/list`);
  return response.data;
};

export const getKelasKamarListAplicares = async () => {
  const response = await axiosPendaftaranInstance.get(`/kelas-aplicare/list`);
  return response.data;
};

export const getListKamar = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/kamar/list?${params}`
  );
  return response.data;
};

export const getTempatTidurRl = async () => {
  const response = await axiosPendaftaranInstance.get(
    `/jenis/layanan/list?typeofcare_code=RINAP`
  );

  return response.data;
};

// Kamar

export const getKamar = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/kamar?${params}`);
  return response.data;
};

export const postKamar = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/kamar`, payload);
  return response.data;
};

export const updateKamar = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/kamar`, payload);
  return response.data;
};

// Kelas Aplicare

export const getKelasRuangAplicare = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/kelas-aplicare?${params}`
  );
  return response.data;
};

export const postKelasRuangAplicare = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/kelas-aplicare`,
    payload
  );
  return response.data;
};

export const updateKelasRuangAplicare = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/kelas-aplicare`,
    payload
  );
  return response.data;
};

// Ruang Aplicare

export const getRuangAplicare = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/ruangan-aplicare?${params}`
  );
  return response.data;
};

export const postRuangAplicare = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/ruangan-aplicare`,
    payload
  );
  return response.data;
};

export const updateRuangAplicare = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/ruangan-aplicare`,
    payload
  );
  return response.data;
};

// Gol Rs Online

export const getKelasRsOnline = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/kelas/kamar/rs/online?${params}`
  );
  return response.data;
};

export const postKelasRsOnline = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/kelas/kamar/rs/online`,
    payload
  );
  return response.data;
};

export const updateKelasRsOnline = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/kelas/kamar/rs/online`,
    payload
  );
  return response.data;
};
