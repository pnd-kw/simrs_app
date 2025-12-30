import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDialog from "@/hooks/ui/use-dialog";
import { useVisualisasiBedStore } from "@/stores/management/bed/useBedManagementStore";
import { SkeletonTable } from "@/utils/skeletonLoader";
import { formatDate } from "@/utils/tanggal/formatDate";
import { Icon } from "@iconify/react";
import DialogUbahKondisiBed from "../monitoring_bed/DialogUbahKondisiBed";

const RightPanelVisualisasi = ({ mode }) => {
  const { open } = useDialog();
  const { detailBed, summary, isLoading } = useVisualisasiBedStore();

  return (
    <>
      {isLoading ? (
        <div>
          <SkeletonTable />
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="rounded-lg border p-2 text-sm">
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Jumlah Kamar</span>
              <span>:</span>
              <span className="flex justify-end">
                {summary.jumlah_kamar || 0}
              </span>
            </div>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Jumlah Bed</span>
              <span>:</span>
              <span className="flex justify-end">{summary.jml_bed || 0}</span>
            </div>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Belum Siap</span>
              <span>:</span>
              <span className="flex justify-end">
                {summary.belum_siap || 0}
              </span>
            </div>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Siap</span>
              <span>:</span>
              <span className="flex justify-end">{summary.siap || 0}</span>
            </div>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Terpakai</span>
              <span>:</span>
              <span className="flex justify-end">{summary.terpakai || 0}</span>
            </div>
          </div>

          <div className="rounded-lg border p-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xl">
                {detailBed?.data_bed?.nama_bed || "-"}
              </span>
              <div className="flex gap-2 items-center">
                <div>
                  <Badge
                    className={`
                  w-full p-2 text-center uppercase rounded-md
                  ${
                    detailBed?.data_bed?.kondisi_bed === 1
                      ? "bg-[#F09F00] text-white"
                      : detailBed?.data_bed?.kondisi_bed === 2
                      ? "bg-[#296218] text-white"
                      : detailBed?.data_bed?.kondisi_bed === 3
                      ? "bg-[#CC2B1D] text-white"
                      : "bg-transparent text-gray-500"
                  }
                  `}
                  >
                    {detailBed?.data_bed?.kondisi_bed === 1 && "Belum Siap"}
                    {detailBed?.data_bed?.kondisi_bed === 2 && "Siap"}
                    {detailBed?.data_bed?.kondisi_bed === 3 && "Terpakai"}
                    {!detailBed?.data_bed?.kondisi_bed && "-"}
                  </Badge>
                </div>
                {mode === "default" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          disabled={!detailBed}
                          type="button"
                          variant="ghost"
                          className={`rounded-sm hover:opacity-80 ${
                            detailBed
                              ? "bg-[#296218] text-white"
                              : "bg-grey1 text-white"
                          }`}
                          onClick={() =>
                            open({
                              contentTitle: "Ubah Status Bed",
                              component: DialogUbahKondisiBed,
                              props: { source: "detailBed" },
                            })
                          }
                        >
                          <Icon icon="mdi:bed-clock" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {detailBed ? "Rubah kondisi bed" : "-"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
            <h4 className="font-bold">DATA BED</h4>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Kelas</span> <span>:</span>
              <span>{detailBed?.data_bed?.nama_kelas || "-"}</span>
            </div>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Kamar</span> <span>:</span>
              <span>{detailBed?.data_bed?.nama_kamar || "-"}</span>
            </div>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Ruang</span> <span>:</span>
              <span>{detailBed?.data_bed?.nama_ruang || "-"}</span>
            </div>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Total Waiting</span> <span>:</span>
              <span>{`${
                detailBed?.data_bed?.jumlah_waiting || "0"
              } Pasien`}</span>
            </div>
          </div>

          <div className="rounded-lg border p-2 text-sm">
            <h4 className="font-bold mb-2">DATA KUNJUNGAN</h4>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Check In</span>
              <span>:</span>
              <span>
                {formatDate(detailBed?.data_kunjungan?.tanggal_kunjungan) ||
                  "-"}
              </span>
            </div>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>ID Kunjungan</span>
              <span>:</span>
              <span>{detailBed?.data_kunjungan?.id_registrasi || "-"}</span>
            </div>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>No. RM</span>
              <span>:</span>
              <span>{detailBed?.data_kunjungan?.no_rm || "-"}</span>
            </div>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Nama RM</span>
              <span>:</span>
              <span>{detailBed?.data_kunjungan?.nama_pasien || "-"}</span>
            </div>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Tgl Kunjungan</span>
              <span>:</span>
              <span>
                {formatDate(detailBed?.data_kunjungan?.tanggal_kunjungan) ||
                  "-"}
              </span>
            </div>
            <div className="grid grid-cols-[150px_10px_1fr]">
              <span>Kelas</span>
              <span>:</span>
              <span>
                {detailBed?.data_kunjungan?.nama_kelas_kunjungan || "-"}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RightPanelVisualisasi;
