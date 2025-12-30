import { create } from "zustand";

const useBookingStore = create((set) => ({
  bookingRs: {
    bookingRsData: {},
    isSuccessSubmitBookingRs: false,
  },

  setBookingRsData: (data) =>
    set((state) => ({
      bookingRs: { ...state.bookingRs, bookingRsData: data },
    })),

  setIsSuccessSubmitBookingRs: (value) =>
    set((state) => ({
      bookingRs: { ...state.bookingRs, isSuccessSubmitBookingRs: value },
    })),
}));

export default useBookingStore;
