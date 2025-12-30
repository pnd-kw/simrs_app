import useNoRujukanStore from "@/stores/useNoRujukanStore";

const useNoRujukan = (formKey) => {
  const noRujukan = useNoRujukanStore((state) => state.noRujukanMap[formKey]);
  const set = useNoRujukanStore((state) => state.setNoRujukanData);
  const clear = useNoRujukanStore((state) => state.clearNoRujukanData);

  return {
    noRujukan,
    setNoRujukan: (data) => set(formKey, data),
    clearNoRujukan: () => clear(formKey),
  };
};

export default useNoRujukan;
