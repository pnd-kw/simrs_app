const { axiosPendaftaranInstance } = require("../axiosInstance");

export const getListRujukan = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/vclaim/rujukan/list/nokartu?${params}`
  );
  return response.data;
};
