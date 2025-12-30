import { getJenisLayanan } from "@/api_disabled/master/layanan";
import { useQuery } from "@tanstack/react-query";

export const useFetchJenisLayanan = () => {
  return useQuery({
    queryKey: ["jenis layanan"],
    queryFn: getJenisLayanan,
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
