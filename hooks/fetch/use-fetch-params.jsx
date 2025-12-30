import toastWithProgress from "@/utils/toast/toastWithProgress";
import { useQuery } from "@tanstack/react-query";

export const useFetchParams = ({
  queryKey,
  apiFn,
  params,
  mapFn,
  errorMessage = "",
  auto = true,
  onErrorHandler,
}) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      try {
        const data = await apiFn(params);
        if (mapFn) {
          return {
            items: mapFn(data?.data ?? []),
          };
        }

        return data;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          errorMessage ||
          "Terjadi kesalahan saat memuat data.";

        if (typeof onErrorHandler === "function") {
          onErrorHandler(err, message);
        } else {
          toastWithProgress({
            title: "Gagal",
            description: message,
            duration: 3000,
            type: "error",
          });
        }

        throw new Error(message);
      }
    },
    enabled: auto && !!params,
    retry: 3,
  });
};
