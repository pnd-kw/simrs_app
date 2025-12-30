import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDeleteTarget from "../store/use-delete-target";
import toastWithProgress from "@/utils/toast/toastWithProgress";

export const useDelete = ({ queryKey, apiFn }) => {
  const queryClient = useQueryClient();
  const { clearId } = useDeleteTarget();

  return useMutation({
    mutationFn: async (id) => {
      const response = await apiFn(id);
      return response;
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries([queryKey]);

      const previousData = queryClient.getQueryData([queryKey]);

      queryClient.setQueryData([queryKey], (old) => {
        if (!old) return old;
        return old.filter((item) => item.id !== id);
      });

      return { previousData };
    },

    onError: (error, _variables, context) => {
      console.error("Failed to delete record", error);

      if (context?.previousData) {
        queryClient.setQueryData([queryKey], context.previousData);
      }

      toastWithProgress({
        title: "Gagal",
        description: error?.message || "Terjadi kesalahan saat menghapus.",
        duration: 3000,
        type: "error",
      });
    },

    onSuccess: (data) => {
      if (data.message === "Sukses") {
        toastWithProgress({
          title: "Sukses",
          description: "Berhasil menghapus record.",
          duration: 3000,
          type: "success",
        });

        clearId();
      } else {
        toastWithProgress({
          title: "Gagal",
          description: "Gagal menghapus record.",
          duration: 3000,
          type: "error",
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries([queryKey]);
    },
  });
};
