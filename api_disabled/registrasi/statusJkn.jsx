import { axiosPendaftaranInstance } from "../axiosInstance";

export const getStatusJkn = async (params) => {
  const response = await axiosPendaftaranInstance(
    `/ws/bpjs/antrean/list/kodebooking?kodebooking=${params}`
  );
  return response.data;
};
