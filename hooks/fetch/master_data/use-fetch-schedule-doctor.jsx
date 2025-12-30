import { buildQueryString } from "@/utils/buildQueryString";
import { useQuery } from "@tanstack/react-query";

export const useFetchScheduleDoctor = ({ queryKey, apiFn, params }) => {
  return useQuery({
    queryKey: [queryKey, params],
    queryFn: async () => {
      const queryString = buildQueryString(params);
      const data = await apiFn(queryString);
      return data.data.map((item) => ({
        id: item.id,
        day: item.day,
        start: item.time_start,
        finish: item.time_finish,
      }));
    },
    staleTime: 0,
    enabled: !!params?.doctor_id,
    initialData: [],
  });
};
