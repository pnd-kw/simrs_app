import { axiosPendaftaranInstance } from "../axiosInstance";

export const getListKabupaten = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/referensi/kabupaten?kode_provinsi=${params}`
  );
  return response.data;
};
