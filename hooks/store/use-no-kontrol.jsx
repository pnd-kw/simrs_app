import useNoKontrolStore from "@/stores/useNoKontrolStore";

const useNoKontrol = (formKey) => {
  const noKontrol = useNoKontrolStore((state) => state.noKontrolMap[formKey]);
  const set = useNoKontrolStore((state) => state.setNoKontrolData);
  const clear = useNoKontrolStore((state) => state.clearNoKontrolData);

  return {
    noKontrol,
    setNoKontrol: (data) => set(formKey, data),
    clearNoKontrol: () => clear(formKey),
  };
};

export default useNoKontrol;
