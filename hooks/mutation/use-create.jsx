import toastWithProgress from "@/utils/toast/toastWithProgress";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreate = ({
  apiFn,
  queryKey,
  successMessage = "",
  errorMessage = "",
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiFn(payload);
      return response;
    },

    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] });

      const previousData = queryClient.getQueryData([queryKey]);

      const optimisticId = Date.now() + Math.floor(Math.random() * 1000);

      const optimisticItem = {
        ...newItem,
        id: optimisticId,
        optimistic: true, 
      };

      queryClient.setQueryData([queryKey], (old) => {
        if (!old) return { data: [optimisticItem] };
        return { ...old, data: [...old.data, optimisticItem] };
      });

      return { previousData, optimisticId };
    },

    onError: (error, _newItem, context) => {
      console.error(errorMessage, error);

      if (context?.previousData) {
        queryClient.setQueryData([queryKey], context.previousData); 
      }
      toastWithProgress({
        title: "Gagal",
        description: errorMessage,
        duration: 3000,
        type: "error",
      });
    },

    onSuccess: (data) => {
      queryClient.setQueryData([queryKey], (old) => {
        if (!old) return { data: [data] };
        return {
          ...old,
          data: [
            ...old.data.filter((item) => !item.optimistic), 
            data,
          ],
        };
      });

      toastWithProgress({
        title: "Sukses",
        description: successMessage,
        duration: 3000,
        type: "success",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};
