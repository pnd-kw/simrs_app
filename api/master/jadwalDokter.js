import { axiosPendaftaranInstance } from "../axiosInstance";

export const getJadwalDokter = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/dokter/jadwal?${params}`
  );
  return response.data;
};

export const getJadwalDokterHFIS = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/ws/bpjs/referensi/jadwal/dokter?${params}`
  );
  return response.data;
};

export const postJadwalDokter = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/dokter/jadwal`,
    payload
  );
  return response.data;
};

export const updateJadwalDokter = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/dokter/jadwal`,
    payload
  );
  return response.data;
};
