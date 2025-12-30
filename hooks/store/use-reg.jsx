import useRegStore from "@/stores/useRegStore";

const useReg = () => {
  const regId = useRegStore((state) => state.dataReg.id_registration);
  const nama = useRegStore((state) => state.dataReg.nama);
  const doctorId = useRegStore((state) => state.dataReg.doctor_id);
  const noAsuransi = useRegStore((state) => state.dataReg.no_asuransi);
  const setDataReg = useRegStore((state) => state.setDataReg);

  return {
    regId,
    nama,
    doctorId,
    noAsuransi,
    setDataReg,
  };
};

export default useReg;
