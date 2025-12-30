import { axiosPendaftaranInstance } from "../axiosInstance";

export const getListKecamatan = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/referensi/kecamatan?kode_kabupaten=${params}`
  );
  return response.data;
};
