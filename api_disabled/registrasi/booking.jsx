import { axiosPendaftaranInstance } from "../axiosInstance";

export const getListBooking = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/booking/rajal?${params}`
  );
  return response.data;
};

export const createBooking = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    "/booking/rajal",
    payload
  );
  return response;
};

export const printAntrianBooking = async (params) => {
  const response = await axiosPendaftaranInstance.post(
    `/cetak/booking/?id=${params}`
  );
  return response;
};

export const cancelBooking = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    "/booking/rajal/cancel",
    payload
  );
  return response;
};
