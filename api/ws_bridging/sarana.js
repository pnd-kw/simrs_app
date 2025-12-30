import { axiosPendaftaranInstance } from "../axiosInstance";

export const getSarana = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/rujukan/sarana?${params}`
  );
  return response.data;
};

export const postSarana = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/vclaim/rujukan/sarana`,
    payload
  );
  return response.data;
};

export const updateSarana = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/vclaim/rujukan/sarana`,
    payload
  );
  return response.data;
};
