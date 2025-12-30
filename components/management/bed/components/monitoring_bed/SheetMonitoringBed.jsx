import DynamicFormFields from "@/components/DynamicFormView";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useDialog from "@/hooks/ui/use-dialog";
import {
  useBedEditStore,
  useWaitingListBedStore,
} from "@/stores/management/bed/useBedManagementStore";
import { todayString } from "@/utils/tanggal/formatDate";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  defaultFormValuesCreateWaitingList,
  defaultFormValuesUpdateWaitingList,
  getSheetMonitoringBedDataKunjunganCheckboxes,
  getSheetMonitoringBedDataKunjunganFields,
  getSheetMonitoringBedFields,
  getUpdateSheetMonitoringBedDataKunjunganFields,
  getUpdateSheetMonitoringBedFields,
} from "./SheetMonitoringBedFields";
import { useRawatInapStore } from "@/stores/rawat_inap/useRawatInapStore";
import VisualisasiLayout from "../visualisasi/VisualisasiLayout";

export function SheetMonitoringBed({ mode = "create", trigger, data }) {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({
    defaultValues:
      mode === "create"
        ? defaultFormValuesCreateWaitingList
        : defaultFormValuesUpdateWaitingList,
  });
  const { open, close } = useDialog();
  const {
    addWaitingListBed,
    updateWaitingListBed,
    checkinWaitingListBed,
    deleteWaitingListBed,
  } = useWaitingListBedStore();
  const { bedExist } = useBedEditStore();
  const { selectedRow: selectedRowRanap } = useRawatInapStore();

  useEffect(() => {
    if (mode === "edit" && data) {
      reset({
        id: data.id,
        bed_id: data.data_bed?.id_bed,
        nama_bed: data.data_bed?.nama_bed || "",
        nama_kamar: data.data_bed?.nama_kamar || "",
        nama_kelas: data.data_bed?.nama_kelas || "",
        id_kunjungan: data.rawatinap_id || "",
        tanggal_kunjungan: data.data_kunjungan?.tanggal_kunjungan || null,
        date_waiting: data.date_waiting || null,
        no_rm: data.data_kunjungan?.no_rm || "",
        nama_pasien: data.data_kunjungan?.nama_pasien || "",
        nama_kelas_kunjungan: data.data_kunjungan?.nama_kelas_kunjungan || "",
        date_estimated_discharge:
          data.data_kunjungan?.date_estimated_discharge || "",
        date_start: todayString,
        remark: data.catatan || "",
      });
    }
    if (mode === "create" && bedExist) {
      reset({
        bed_id: bedExist?.data_bed?.id_bed || "",
        nama_bed: bedExist?.data_bed?.nama_bed || "",
        nama_kamar: bedExist?.data_bed?.nama_kamar || "",
        nama_kelas: bedExist?.data_bed?.nama_kelas || "",

        id_kunjungan: selectedRowRanap?.id,
        tanggal_kunjungan: selectedRowRanap?.date,
        date_waiting: selectedRowRanap?.date_waiting || todayString,
        no_rm: selectedRowRanap?.rm_norm,
        nama_pasien: selectedRowRanap?.rm_name,
        nama_kelas_kunjungan: selectedRowRanap?.bed_kelas_name,
        date_start: todayString || undefined,
        is_booking: false,
        remark: selectedRowRanap?.catatan || "",
      });
    }
  }, [mode, data, bedExist, selectedRowRanap?.id, setValue]);

  const onSubmit = async (formData) => {
    try {
      if (mode === "create") {
        await addWaitingListBed(formData);
      } else {
        await updateWaitingListBed({ ...formData, id: formData.id });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckin = async (formData) => {
    try {
      await checkinWaitingListBed({ id: formData.id });
      close();
    } catch (err) {
      console.error(err);
    }
  };

  const handleHapus = async (formData) => {
    try {
      await deleteWaitingListBed(formData.id);
      close();
    } catch (err) {
      console.error(err);
    }
  };

  const fields =
    mode === "create"
      ? getSheetMonitoringBedFields()
      : getUpdateSheetMonitoringBedFields(setValue, open, close);

  const dataKunjungan =
    mode === "create"
      ? getSheetMonitoringBedDataKunjunganFields(setValue, open)
      : getUpdateSheetMonitoringBedDataKunjunganFields();

  const checkbox =
    mode === "create"
      ? getSheetMonitoringBedDataKunjunganCheckboxes()
      : getSheetMonitoringBedDataKunjunganCheckboxes();

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        className="sm:max-w-[900px] bg-[#FAFAFA]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="uppercase">
            {mode === "create" ? "Check in / Booking" : "Update Waiting List"}
          </SheetTitle>
        </SheetHeader>
        <Card className="mx-4">
          <div className="p-4">
            <div className="flex items-center justify-between mb-5">
              <h1 className="uppercase font-bold">Data Bed</h1>
              {mode === "create" && (
                <DynamicFormFields
                  checkboxes={checkbox}
                  control={control}
                  errors={errors}
                  gridCols="grid-cols-1"
                />
              )}
            </div>

            <DynamicFormFields
              fields={fields}
              control={control}
              errors={errors}
              gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
            />

            <h1 className="uppercase font-bold my-5">Data Kunjungan</h1>
            <DynamicFormFields
              fields={dataKunjungan}
              control={control}
              errors={errors}
              gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            />
          </div>
        </Card>

        <div className="flex justify-between mx-4">
          <SheetClose asChild>
            <Button variant="red2">Batal</Button>
          </SheetClose>

          <div className="flex gap-2">
            {mode === "edit" && (
              <>
                <Button
                  type="submit"
                  variant="red1"
                  onClick={handleSubmit(handleHapus)}
                >
                  Hapus
                </Button>
                <Button
                  type="submit"
                  variant="lightBlue"
                  onClick={() =>
                    open({
                      contentTitle: `Alih Bed - ${data.data_bed?.nama_bed} - ${data.data_kunjungan?.nama_pasien}`,
                      component: VisualisasiLayout,
                      props: {
                        data: data,
                        mode: "alihBed",
                      },
                    })
                  }
                >
                  alih bed
                </Button>
                <Button
                  type="submit"
                  variant="yellow1"
                  onClick={handleSubmit(onSubmit)}
                >
                  Update
                </Button>
                <Button
                  type="submit"
                  variant="primary1"
                  onClick={handleSubmit(handleCheckin)}
                >
                  Checkin
                </Button>
              </>
            )}
            {mode === "create" && (
              <Button
                type="submit"
                variant="primary1"
                onClick={handleSubmit(onSubmit)}
              >
                Simpan
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
