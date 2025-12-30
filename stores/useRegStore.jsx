import { create } from "zustand";

const useRegStore = create((set) => ({
  dataReg: {
    id_registration: null,
    nama: null,
    doctor_id: null,
    no_asuransi: null,
  },
  setDataReg: (data) =>
    set((state) => ({
      dataReg: {
        ...state.dataReg,
        id_registration: data.id_registration,
        nama: data.nama,
        doctor_id: data.doctor_id,
        no_asuransi: data.no_asuransi,
      },
    })),
}));

export default useRegStore;
