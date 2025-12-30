import { axiosPendaftaranInstance } from "../axiosInstance";

export const getMonitoringBed = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/bed/monitoring?${params}`
  );
  return response.data;
};

export const postMonitoringBed = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/bed/monitoring`,
    payload
  );
  return response.data;
};

export const updateMonitoringBed = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/bed/monitoring`,
    payload
  );
  return response.data;
};

export const deleteMonitoringBed = async (params) => {
  const response = await axiosPendaftaranInstance.delete(
    `/bed/monitoring/${params}`
  );
  return response.data;
};

export const getDataExistingBed = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/bed/exist?${params}`);
  return response.data;
};

export const getDataWaitingListBed = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/bed/waiting/list?${params}`
  );
  return response.data;
};

export const postDataWaitingListBed = async (payload) => {
  const response = await axiosPendaftaranInstance.post(
    `/bed/waiting/list`,
    payload
  );
  return response.data;
};

export const updateDataWaitingListBed = async (payload) => {
  const response = await axiosPendaftaranInstance.put(
    `/bed/waiting/list`,
    payload
  );
  return response.data;
};

export const postCheckinWaitingListBed = async (payload) => {
  const response = await axiosPendaftaranInstance.post(`/bed/checkin`, payload);
  return response.data;
};

export const updateKondisiBed = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/bed/kondisi`, payload);
  return response.data;
};

export const deleteCheckinBed = async (params) => {
  const response = await axiosPendaftaranInstance.delete(
    `/bed/waiting/list/${params}`
  );
  return response.data;
};

// Histori Bed

export const getHistoriBed = async (params) => {
  const response = await axiosPendaftaranInstance.get(`/bed/history?${params}`);
  return response.data;
};

export const updateHistoriBed = async (payload) => {
  const response = await axiosPendaftaranInstance.put(`/bed/history`, payload);
  return response.data;
};

export const deleteHistoriBed = async (params) => {
  const response = await axiosPendaftaranInstance.delete(
    `/bed/history/${params}`
  );
  return response.data;
};

// visualisasi

export const getVisualisasiBed = async (params) => {
  const response = await axiosPendaftaranInstance.get(
    `/bed/visualisasi?${params}`
  );
  return response.data;
};
