import { axiosPendaftaranInstance } from "../axiosInstance";

export const getMovieList = async () => {
  const response = await axiosPendaftaranInstance.get(`/movie/display/list`);
  return response.data;
};
