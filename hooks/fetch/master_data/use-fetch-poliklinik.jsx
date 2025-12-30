import { getListPoliklinik } from "@/api_disabled/master/poliklinik";
import { useQuery } from "@tanstack/react-query";

export const useFetchPoliklinik = () => {
  return useQuery({
    queryKey: ["poliklinik"],
    queryFn: getListPoliklinik,
    select: (res) =>
      res.data.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    initialData: [],
  });
};
