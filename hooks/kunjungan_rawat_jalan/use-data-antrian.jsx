import useDataAntrianStore from "@/stores/kunjungan_rawat_jalan/useDataAntrianStore";

const useDataAntrian = () => {
  const dataAntrian = useDataAntrianStore((state) => state.dataAntrian.data);
  const setDataAntrian = useDataAntrianStore((state) => state.setDataAntrian);
  const isSuccessGetDataAntrian = useDataAntrianStore((state) => state.dataAntrian.isSuccessGetDataAntrian);
  const setIsSuccessGetDataAntrian = useDataAntrianStore((state) => state.setIsSuccessGetDataAntrian);

  return {
    dataAntrian,
    setDataAntrian,
    isSuccessGetDataAntrian,
    setIsSuccessGetDataAntrian,
  };
};

export default useDataAntrian;
