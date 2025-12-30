import { useMutation, useQueryClient } from "@tanstack/react-query";
import toastWithProgress from "@/utils/toast/toastWithProgress";

export const useUpdate = ({
  apiFn,
  queryKey,
  idKey = "id",
  updateKeys = [],
  successMessage = "",
  errorMessage = "",
  refetchOnSuccess = false,
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiFn(payload);
      return response;
    },

    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries([queryKey]);

      const previousData = queryClient.getQueryData([queryKey]);

      if (!refetchOnSuccess) {
        queryClient.setQueryData([queryKey], (old) => {
          if (!old) return old;

          const items = Array.isArray(old) ? old : old.data;

          if (!Array.isArray(items)) return old;

          const newItems = items.map((item) => {
            if (item[idKey] !== updatedItem[idKey]) return item;

            const updatedFields = updateKeys.reduce((acc, key) => {
              if (key in updatedItem) {
                acc[key] = updatedItem[key];
              }
              return acc;
            }, {});

            return { ...item, ...updatedFields, _optimistic: true };
          });

          return Array.isArray(old) ? newItems : { ...old, data: newItems };
        });
      }

      return { previousData };
    },

    onError: (error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([queryKey], context.previousData);
      }

      const message =
        errorMessage ||
        error?.response?.data?.data?.metadata?.message ||
        error?.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan.";

      toastWithProgress({
        title: "Gagal",
        description: message,
        duration: 3000,
        type: "error",
      });
    },

    onSuccess: (data) => {
      if (refetchOnSuccess) {
        queryClient.invalidateQueries([queryKey]);
      } else {
        queryClient.setQueryData([queryKey], (old) => {
          if (!old) return Array.isArray(data) ? data : [data];

          const items = Array.isArray(old) ? old : old.data;

          if (!Array.isArray(items)) return old;

          const newItems = items.map((item) =>
            item[idKey] === data[idKey] ? { ...data } : item
          );

          return Array.isArray(old) ? newItems : { ...old, data: newItems };
        });
      }

      toastWithProgress({
        title: "Sukses",
        description: successMessage,
        duration: 3000,
        type: "success",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries([queryKey]);
    },
  });
};
