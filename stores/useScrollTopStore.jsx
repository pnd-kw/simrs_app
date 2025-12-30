import { create } from "zustand";

const useScrollTopStore = create((set, get) => ({
  scroller: null,
  setScroller: (el) => set({ scroller: el }),
  scrollToTop: () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
}));

export default useScrollTopStore;
