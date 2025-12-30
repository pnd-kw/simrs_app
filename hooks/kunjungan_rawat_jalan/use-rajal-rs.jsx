import useRajalStore from "@/stores/kunjungan_rawat_jalan/useRajalStore";

const useRajalRs = () => {
  const rajalRsData = useRajalStore((state) => state.rajalRs.rajalRsData);
  const setRajalRsData = useRajalStore((state) => state.setRajalRsData);
  const isSuccessSubmitRajalRs = useRajalStore(
    (state) => state.rajalRs.isSuccessSubmitRajalRs
  );
  const isSuccessUpdateRajalRs = useRajalStore(
    (state) => state.rajalRs.isSuccessUpdateRajalRs
  );
  const setIsSuccessSubmitRajalRs = useRajalStore(
    (state) => state.setIsSuccessSubmitRajalRs
  );
  const setIsSuccessUpdateRajalRs = useRajalStore(
    (state) => state.setIsSuccessUpdateRajalRs
  );

  return {
    rajalRsData,
    setRajalRsData,
    isSuccessSubmitRajalRs,
    isSuccessUpdateRajalRs,
    setIsSuccessSubmitRajalRs,
    setIsSuccessUpdateRajalRs,
  };
};

export default useRajalRs;
