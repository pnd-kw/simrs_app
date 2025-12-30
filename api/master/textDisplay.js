import { axiosPendaftaranInstance } from "../axiosInstance";

export const getTextDisplayKunjungan = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/text/display?jenis=1&${params}`
  );
  return response.data;
};

export const getTextDisplayLoket = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/text/display?jenis=2&${params}`
  );
  return response.data;
};

export const postTextDisplay = async (payload) => {
  const res = await axiosPendaftaranInstance.post("/text/display", payload);
  return res.data;
};

export const updateTextDisplay = async (payload) => {
  const res = await axiosPendaftaranInstance.put("/text/display", payload);
  return res.data;
};

export const getTextDisplayLoketList = async () => {
  const response = await axiosPendaftaranInstance.get(`/text/display/list`);
  return response.data;
};
