import { axiosPendaftaranInstance } from "../axiosInstance";

export const getManagementDisplay = async () => {
  const response = await axiosPendaftaranInstance.get(
    `/display/antrian`
  );
  return response.data;
};

export const postManagementDisplay = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/display/antrian`,
    payload
  );
  return response.data;
};

export const updateManagementDisplay = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/display/antrian`,
    payload
  );
  return response.data;
};

export const deleteManagementDisplay = async (params) => {
  const response = await axiosPendaftaranInstance.delete(
    `/display/antrian/${params}`
  );
  return response.data;
};