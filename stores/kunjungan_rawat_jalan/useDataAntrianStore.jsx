import { create } from "zustand";

const useDataAntrianStore = create((set) => ({
  dataAntrian: {
    data: {},
    isSuccessGetDataAntrian: false,
  },
  setDataAntrian: (val) =>
    set((state) => ({ dataAntrian: { ...state.dataAntrian, data: val } })),
  setIsSuccessGetDataAntrian: (value) =>
    set((state) => ({
      dataAntrian: { ...state.dataAntrian, isSuccessGetDataAntrian: value },
    })),
}));

export default useDataAntrianStore;
