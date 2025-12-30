import { axiosPendaftaranInstance } from "../axiosInstance";

export const tutupKunjungan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    "/registrasi/tutup",
    payload
  );
  return response;
};

export const bukaKunjungan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    "/registrasi/buka",
    payload
  );
  return response;
};

export const batalKunjungan = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    "/registrasi/batal",
    payload
  );
  return response;
};