import { create } from "zustand";

const useDoctorStore = create((set) => ({
  ranap: {
    doctor_id: "",
  },
  rajal: {
    doctor_id: "",
  },
  igd: {
    doctor_id: "",
  },
  booking: {
    doctor_id: "",
  },
  setRanapDoctor: (id) =>
    set((state) => ({ ranap: { ...state.ranap, doctor_id: id } })),
  setRajalDoctor: (id) =>
    set((state) => ({ rajal: { ...state.rajal, doctor_id: id } })),
  setIgdDoctor: (id) =>
    set((state) => ({ igd: { ...state.igd, doctor_id: id } })),
  setBookingDoctor: (id) =>
    set((state) => ({ booking: { ...state.booking, doctor_id: id } })),
}));

export default useDoctorStore;
