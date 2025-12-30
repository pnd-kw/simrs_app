import DynamicFormFields from "@/components/DynamicFormView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDialog from "@/hooks/ui/use-dialog";
import {
  useBedEditStore,
  useMonitoringBedStore,
  useWaitingListBedStore,
} from "@/stores/management/bed/useBedManagementStore";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import VisualisasiLayout from "../visualisasi/VisualisasiLayout";
import DialogUbahKondisiBed from "./DialogUbahKondisiBed";
import {
  defaultFormValuesMonitoringBed,
  getMonitoringBedDataBedFields,
  getMonitoringBedDataKunjunganFields,
} from "./MonitoringBedFields";
import { SheetMonitoringBed } from "./SheetMonitoringBed";
import WaitingListCards from "./WaitingListCards";

const MonitoringBedLayout = () => {
  const { open } = useDialog();
  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({
    defaultValues: defaultFormValuesMonitoringBed,
  });

  const { bedExist, bedWaiting, reset: resetStore } = useBedEditStore();
  const { fetchMonitoringBed } = useMonitoringBedStore();
  const { updateWaitingListBed } = useWaitingListBedStore();
  const fields = getMonitoringBedDataBedFields();
  const fieldsDataKunjungan = getMonitoringBedDataKunjunganFields();

  const onSubmit = async (formData) => {
    try {
      await updateWaitingListBed({ ...formData, id: bedExist.id });
    } catch (err) {
      console.error(err);
    }
  };

  const onReset = async () => {
    resetStore();
    reset();
  };

  useEffect(() => {
    fetchMonitoringBed();
  }, []);

  useEffect(() => {
    if (bedExist) {
      setValue("bed_id", bedExist?.data_bed?.id_bed || "");
      setValue("nama_bed", bedExist?.data_bed?.nama_bed || "");
      setValue("nama_kamar", bedExist?.data_bed?.nama_kamar || "");
      setValue("nama_kelas", bedExist?.data_bed?.nama_kelas || "");
      setValue("id_registrasi", bedExist?.data_kunjungan?.id_registrasi || "");
      setValue(
        "tanggal_kunjungan",
        bedExist?.data_kunjungan?.tanggal_kunjungan || ""
      );
      setValue("date_waiting", bedExist?.date_waiting || "");
      setValue("no_rm", bedExist?.data_kunjungan?.no_rm || "");
      setValue("nama_pasien", bedExist?.data_kunjungan?.nama_pasien || "");
      setValue(
        "nama_kelas_kunjungan",
        bedExist?.data_kunjungan?.nama_kelas_kunjungan || ""
      );
      setValue("date_start", bedExist?.date_start || "");
      setValue(
        "rencana_pulang",
        bedExist?.data_kunjungan?.date_estimated_discharge || ""
      );
      setValue("remark", bedExist?.remark || "");
    }
  }, [bedExist]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <Card className="col-span-2 p-4">
        <div>
          <div className="flex justify-between">
            <h2 className="font-bold text-sm mb-4">DATA BED</h2>
            <div className="flex gap-2 items-center mb-3">
              <div>
                <Badge
                  className={`
      w-full p-2 text-center uppercase rounded-md
      ${
        bedExist?.data_bed?.kondisi_bed === 1
          ? "bg-[#F09F00] text-white"
          : bedExist?.data_bed?.kondisi_bed === 2
          ? "bg-[#296218] text-white"
          : bedExist?.data_bed?.kondisi_bed === 3
          ? "bg-[#CC2B1D] text-white"
          : "bg-transparent text-gray-500"
      }
    `}
                >
                  {bedExist?.data_bed?.kondisi_bed === 1 && "Belum Siap"}
                  {bedExist?.data_bed?.kondisi_bed === 2 && "Siap"}
                  {bedExist?.data_bed?.kondisi_bed === 3 && "Terpakai"}
                  {!bedExist?.data_bed?.kondisi_bed && "-"}
                </Badge>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={!bedExist}
                      type="button"
                      variant="ghost"
                      className={`rounded-sm hover:opacity-80 ${
                        bedExist
                          ? "bg-[#296218] text-white"
                          : "bg-grey1 text-white"
                      }`}
                      onClick={() =>
                        open({
                          contentTitle: "Ubah Status Bed",
                          component: DialogUbahKondisiBed,
                          props: { source: "bedExist" },
                        })
                      }
                    >
                      <Icon icon="mdi:bed-clock" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {bedExist ? "Rubah kondisi bed" : "-"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <DynamicFormFields
            fields={fields}
            control={control}
            errors={errors}
            gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
          />
        </div>

        <div>
          <h2 className="font-bold mb-4 text-sm">DATA KUNJUNGAN</h2>
          <DynamicFormFields
            fields={fieldsDataKunjungan}
            control={control}
            errors={errors}
            gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          />
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            disabled={!bedExist}
            variant={!bedExist ? "gray" : "red2"}
            className="rounded-sm"
            size="sm"
            onClick={onReset}
          >
            <Icon icon="fluent:arrow-sync-12-filled" />
            Reset
          </Button>
          <div className="flex gap-2">
            <Button
              disabled={!bedExist?.data_kunjungan}
              variant={!bedExist?.data_kunjungan ? "gray" : "yellow1"}
              onClick={handleSubmit(onSubmit)}
            >
              UPDATE
            </Button>
            <Button
              disabled={!bedExist?.data_kunjungan}
              variant={!bedExist?.data_kunjungan ? "gray" : "skyBlue"}
              onClick={() =>
                open({
                  contentTitle: `Alih Bed - ${bedExist.data_bed?.nama_bed} - ${bedExist.data_kunjungan?.nama_pasien}`,
                  component: VisualisasiLayout,
                  props: {
                    data: bedExist,
                    mode: "alihBed",
                  },
                })
              }
            >
              ALIH BED
            </Button>
          </div>
        </div>
      </Card>

      {/* Kanan (Waiting List) */}
      <Card className="col-span-1 p-6 relative overflow-auto max-h-[80vh]">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">Waiting List</h2>
          <div className="flex gap-2">
            <SheetMonitoringBed
              mode="create"
              trigger={
                <Button
                  disabled={!bedExist}
                  type="button"
                  variant={!bedExist ? "gray" : "primary1"}
                >
                  <Icon icon="lucide:plus" />
                </Button>
              }
            />
            <Button
              disabled={!bedExist}
              variant={!bedExist ? "gray" : "primary1"}
              onClick={async () => {
                if (!bedExist) return;

                const { fetchBedWaiting } = useBedEditStore.getState();
                await fetchBedWaiting(bedExist?.data_bed?.id_bed);
              }}
            >
              <Icon
                icon={
                  !bedExist ? "tabler:refresh-off" : "simple-line-icons:refresh"
                }
              />
            </Button>
          </div>
        </div>

        <div className="relative">
          <WaitingListCards />
        </div>

        {bedWaiting.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            Tidak Ada Data
          </div>
        )}
      </Card>
    </div>
  );
};

export default MonitoringBedLayout;
