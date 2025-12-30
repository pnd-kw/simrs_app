
import { create } from "zustand";

const useNoRujukanStore = create((set) => ({
  noRujukanMap: {},

  setNoRujukanData: (key, data) =>
    set((state) => ({
      noRujukanMap: {
        ...state.noRujukanMap,
        [key]: data,
      },
    })),

  clearNoRujukanData: (key) =>
    set((state) => {
      const newMap = { ...state.noRujukanMap };
      delete newMap[key];
      return { noRujukanMap: newMap };
    }),
}));

export default useNoRujukanStore;
