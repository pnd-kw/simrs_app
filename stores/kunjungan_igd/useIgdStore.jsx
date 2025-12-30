import { create } from "zustand";

const useIgdStore = create((set) => ({
  igdRs: {
    igdRsData: {},
    isSuccessSubmitIgdRs: false,
    isSuccessUpdateIgdRs: false,
  },

  setIgdRsData: (data) =>
    set((state) => ({ igdRs: { ...state.igdRs, igdRsData: data } })),

  setIsSuccessSubmitIgdRs: (value) =>
    set((state) => ({
      igdRs: { ...state.igdRs, isSuccessSubmitIgdRs: value },
    })),

  setIsSuccessUpdateIgdRs: (value) =>
    set((state) => ({
      igdRs: { ...state.igdRs, isSuccessUpdateIgdRs: value },
    })),
}));

export default useIgdStore;
