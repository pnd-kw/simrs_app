import { create } from "zustand";

const useRanapStore = create((set) => ({
  ranapRs: {
    ranapRsData: {},
    isSuccessSubmitRanapRs: false,
  },

  setRanapRsData: (data) =>
    set((state) => ({ ranapRs: { ...state.ranapRs, ranapRsData: data } })),

  setIsSuccessSubmitRanapRs: (value) =>
    set((state) => ({
      ranapRs: { ...state.ranapRs, isSuccessSubmitRanapRs: value },
    })),
}));

export default useRanapStore;
