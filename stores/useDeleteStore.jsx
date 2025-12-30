import { create } from "zustand";

const useDeleteStore = create((set) => ({
  delete: {
    targetId: null,
  },
  setId: (id) =>
    set((state) => ({ delete: { ...state.delete, targetId: id } })),
  clearId: () =>
    set((state) => ({ delete: { ...state.delete, targetId: null } })),
}));

export default useDeleteStore;
