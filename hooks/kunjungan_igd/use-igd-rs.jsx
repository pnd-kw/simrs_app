import useIgdStore from "@/stores/kunjungan_igd/useIgdStore";

const useIgdRs = () => {
  const igdRsData = useIgdStore((state) => state.igdRs.igdRsData);
  const setIgdRsData = useIgdStore((state) => state.setIgdRsData);
  const isSuccessSubmitIgdRs = useIgdStore(
    (state) => state.igdRs.isSuccessSubmitIgdRs
  );
  const isSuccessUpdateIgdRs = useIgdStore(
    (state) => state.igdRs.isSuccessUpdateIgdRs
  );
  const setIsSuccessSubmitIgdRs = useIgdStore(
    (state) => state.setIsSuccessSubmitIgdRs
  );
  const setIsSuccessUpdateIgdRs = useIgdStore(
    (state) => state.setIsSuccessUpdateIgdRs
  );

  return {
    igdRsData,
    setIgdRsData,
    isSuccessSubmitIgdRs,
    isSuccessUpdateIgdRs,
    setIsSuccessSubmitIgdRs,
    setIsSuccessUpdateIgdRs,
  };
};

export default useIgdRs;
