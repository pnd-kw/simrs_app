import { create } from "zustand";

const useNoKontrolStore = create((set) => ({
  noKontrolMap: {},

  setNoKontrolData: (key, data) =>
    set((state) => ({
      noKontrolMap: {
        ...state.noKontrolMap,
        [key]: data,
      },
    })),

  clearNoKontrolData: (key) =>
    set((state) => {
      const newMap = { ...state.noKontrolMap };
      delete newMap[key];
      return { noKontrolMap: newMap };
    }),
}));

export default useNoKontrolStore;
