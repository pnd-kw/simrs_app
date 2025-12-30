import { axiosPendaftaranInstance } from "../axiosInstance";

export const getListProvinsi = async () => {
  const response = await axiosPendaftaranInstance.get(`/vclaim/referensi/provinsi`);
  return response.data;
};