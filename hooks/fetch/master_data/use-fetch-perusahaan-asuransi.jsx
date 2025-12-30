import { getListPerusahaan } from "@/api/master/asuransi";
import { useQuery } from "@tanstack/react-query";

export const useFetchPerusahaanAsuransi = () => {
  return useQuery({
    queryKey: ["perusahaan asuransi"],
    queryFn: getListPerusahaan,
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
