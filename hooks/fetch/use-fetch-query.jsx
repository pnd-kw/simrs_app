import { buildQueryString } from "@/utils/buildQueryString";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { useQuery } from "@tanstack/react-query";

export const useFetchQuery = ({
  queryKey,
  apiFn,
  filters,
  page,
  perPage,
  errorMessage = "",
  resKey = "data",
  metaKey = "meta",
  mapFn,
  enabled = true,
  withPagination = true,
}) => {
  return useQuery({
    queryKey: [queryKey, filters, page, perPage],
    queryFn: async () => {
      try {
        const params = {
          ...filters,
        };
        if (withPagination) {
          params.page = page;
          params.per_page = perPage;
        }
        const queryString = buildQueryString(params);
        const response = await apiFn(queryString);

        const extract = (obj, path) =>
          path.split(".").reduce((acc, key) => acc?.[key], obj);

        const extracted = extract(response, resKey);

        let items;
        if (Array.isArray(extracted)) {
          items = mapFn ? mapFn(extracted) : extracted;
        } else if (extracted && typeof extracted === "object") {
          items = extracted;
        } else {
          items = [];
        }

        return {
          items,
          meta: extract(response, metaKey) ?? {},
        };
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          errorMessage ||
          "Terjadi kesalahan saat memuat data.";

        toastWithProgress({
          title: "Gagal",
          description: message,
          duration: 3000,
          type: "error",
        });

        throw new Error(message);
      }
    },
    keepPreviousData: true,
    enabled,
    retry: false,
  });
};
