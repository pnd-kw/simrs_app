import { axiosPendaftaranInstance } from "../axiosInstance";

export const getKas = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/kas?${params}`);
  return response.data;
};

export const getCoa = async () => {
  const response = await axiosPendaftaranInstance.get("/coa?per_page=9999");
  return response.data;
};

export const simpanKas = async (payload) => {
  const res = await axiosPendaftaranInstance.post("/kas", payload);
  return res.data;
};

export const updateKas = async (payload) => {
  const res = await axiosPendaftaranInstance.put("/kas", payload);
  return res.data;
};
