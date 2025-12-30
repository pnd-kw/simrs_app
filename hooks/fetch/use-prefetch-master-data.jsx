
import { getAsuransi, getListPerusahaan } from "@/api_disabled/master/asuransi";
import { getListDokter } from "@/api_disabled/master/dokter";
import { getJenisLayanan } from "@/api_disabled/master/layanan";
import { getListPoliklinik } from "@/api_disabled/master/poliklinik";
import { useQueryClient } from "@tanstack/react-query";

export const usePrefetchMasterData = () => {
  const queryClient = useQueryClient();

  const masterData = async () => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["asuransi"],
        queryFn: getAsuransi,
      }),
      queryClient.prefetchQuery({
        queryKey: ["dokter"],
        queryFn: getListDokter,
      }),
      queryClient.prefetchQuery({
        queryKey: ["jenis layanan"],
        queryFn: getJenisLayanan,
      }),
      queryClient.prefetchQuery({
        queryKey: ["perusahaan asuransi"],
        queryFn: getListPerusahaan,
      }),
      queryClient.prefetchQuery({
        queryKey: ["poliklinik"],
        queryFn: getListPoliklinik,
      })
    ]);
  };

  return { masterData };
};
