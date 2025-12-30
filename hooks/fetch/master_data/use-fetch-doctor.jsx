import { getListDokter } from "@/api_disabled/master/dokter";
import { useQuery } from "@tanstack/react-query";

export const useFetchDoctor = () => {
  return useQuery({
    queryKey: ["dokter"],
    queryFn: getListDokter,
    select: (res) =>
      res.data.map((item) => ({
        id: item.id,
        name: item.fullname,
        kode_bridge: item.kode_bridge,
        poliklinik_id: item.poliklinik_id,
        spesialis_name: item.spesialis_name,
        spec_code: item.spec_code,
        codebridgepolibpjs: item.codebridgepolibpjs,
      })),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    initialData: [],
  });
};
