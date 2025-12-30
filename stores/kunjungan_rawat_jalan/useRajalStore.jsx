import { create } from "zustand";

const useRajalStore = create((set) => ({
  rajalRs: {
    rajalRsData: {},
    isSuccessSubmitRajalRs: false,
    isSuccessUpdateRajalRs: false,
  },

  setRajalRsData: (data) =>
    set((state) => ({ rajalRs: { ...state.rajalRs, rajalRsData: data } })),

  setIsSuccessSubmitRajalRs: (value) =>
    set((state) => ({
      rajalRs: { ...state.rajalRs, isSuccessSubmitRajalRs: value },
    })),

  setIsSuccessUpdateRajalRs: (value) =>
    set((state) => ({
      rajalRs: { ...state.rajalRs, isSuccessUpdateRajalRs: value },
    })),
    
}));

export default useRajalStore;
