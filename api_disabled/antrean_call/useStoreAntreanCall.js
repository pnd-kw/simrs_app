import { create } from "zustand";
import { axiosInstance } from "../axiosInstance"; 
import { AxiosError } from "axios";

export const useStoreAntreanCall = create((set) => ({
  isLoading: false,
  error: null,
  tipeAntrian: null,
  loketList: null,

  getTipeAntrianList: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/antrian/list/tipe`);
      set({ tipeAntrian: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error, isLoading: false });
        return null;
      }
    }
  },

  getLoketList: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/antrian/list/loket`);
      set({ loketList: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error, isLoading: false });
        return null;
      }
    }
  },

  getAntreanList: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `/antrian/pilih/asuransi?code=${code}`
      );
      set({ antreanList: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error, isLoading: false });
        return null;
      }
    }
  },

  antreanCall: async ({ id, antriantype_code, loketid }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/antrian/call`, {
        id,
        antriantype_code,
        loketid,
      });
      set({ antreanCallData: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error, isLoading: false });
        return null;
      }
    }
  },

  antreanSelesai: async ({ id, antriantype_code }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/antrian/finish`, {
        id,
        antriantype_code
      });
      set({ antreanSelesaiData: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error, isLoading: false });
        return null;
      }
    }
  },
}));
