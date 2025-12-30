import { create } from "zustand";

export const useTabStore = create((set) => ({
  openTabs: [],
  activeTab: null,

  openTab: (key) =>
    set((state) => {
      if (!state.openTabs.includes(key)) {
        return { openTabs: [...state.openTabs, key], activeTab: key };
      }
      return { activeTab: key };
    }),

  setActiveTab: (key) => set({ activeTab: key }),

  closeTab: (key) =>
    set((state) => {
      const newTabs = state.openTabs.filter((t) => t !== key);
      const newActive =
        state.activeTab === key ? newTabs[newTabs.length - 1] || null : state.activeTab;
      return { openTabs: newTabs, activeTab: newActive };
    }),
}));
