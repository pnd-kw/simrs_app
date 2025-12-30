import useRanapStore from "@/stores/kunjungan_rawat_inap/useRanapStore";

const useRanapRs = () => {
  const ranapRsData = useRanapStore((state) => state.ranapRs.ranapRsData);
  const setRanapRsData = useRanapStore((state) => state.setRanapRsData);
  const isSuccessSubmitRanapRs = useRanapStore(
    (state) => state.isSuccessSubmitRanapRs
  );
  const setIsSuccessSubmitRanapRs = useRanapStore(
    (state) => state.setIsSuccessSubmitRanapRs
  );

  return {
    ranapRsData,
    setRanapRsData,
    isSuccessSubmitRanapRs,
    setIsSuccessSubmitRanapRs,
  };
};

export default useRanapRs;
