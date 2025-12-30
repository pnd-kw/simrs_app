
import { getAsuransi, getListPerusahaan } from "@/api/master/asuransi";
import { getListDokter } from "@/api/master/dokter";
import { getJenisLayanan } from "@/api/master/layanan";
import { getListPoliklinik } from "@/api/master/poliklinik";
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
