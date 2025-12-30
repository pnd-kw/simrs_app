import { getAsuransi } from "@/api_disabled/master/asuransi";
import { useQuery } from "@tanstack/react-query";

export const useFetchAsuransi = () => {
  return useQuery({
    queryKey: ["asuransi"],
    queryFn: getAsuransi,
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
