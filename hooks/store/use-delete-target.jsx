import useDeleteStore from "@/stores/useDeleteStore";

const useDeleteTarget = () => {
  const setId = useDeleteStore((state) => state.setId);
  const clearId = useDeleteStore((state) => state.clearId);

  return {
    getTargetId: () => useDeleteStore.getState().delete.targetId,
    setId,
    clearId,
  };
};

export default useDeleteTarget;
