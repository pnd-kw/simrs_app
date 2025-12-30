import DynamicFormFields from "@/components/DynamicFormView";
import { Button } from "@/components/ui/button";
import useDialog from "@/hooks/ui/use-dialog";
import { useHistoriBedStore } from "@/stores/management/bed/useBedManagementStore";
import { useBedStore } from "@/stores/master/useMasterStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  defaultFormValuesHistoriBed,
  getHistoriBedFields,
  HistoriBedSchema,
} from "./HistoriBedFields";

const HistoriBedForm = () => {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(HistoriBedSchema),
    defaultValues: defaultFormValuesHistoriBed,
  });
  const { selectedRow, setSelectedRow } = useBedStore();
  const {
    selectedRow: selectedRowHistori,
    setSelectedRow: setSelectedRowHistori,
    updateHistoriBed,
  } = useHistoriBedStore();
  const { open } = useDialog();
  const fields = getHistoriBedFields(setValue, open);

  const onSubmit = async (data) => {
    const finalBedId = selectedRow?.id
      ? selectedRow.id
      : selectedRowHistori?.bed_id;

    const payload = {
      ...data,
      bed_id: finalBedId,
    };

    try {
      if (selectedRowHistori?.id) {
        await updateHistoriBed({ ...payload, id: selectedRowHistori.id });
      }
      setSelectedRow({});
      setSelectedRowHistori({});
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedRowHistori?.id) {
      setValue("id_kunjungan", selectedRowHistori.id_kunjungan || "");
      setValue("id_rm", selectedRowHistori.id_rm || "");
      setValue("patient_name", selectedRowHistori.patient_name || "");
      setValue("bed_name", selectedRowHistori.bed_name || "");
      setValue("kamar_name", selectedRowHistori.kamar_name || "");
      setValue("kelas_name", selectedRowHistori.kelas_name || "");
      setValue("date_waiting", selectedRowHistori.date_waiting || "");
      setValue("date_start", selectedRowHistori.date_start || "");
      setValue("date_finish", selectedRowHistori.date_finish || "");
    }
    if (selectedRow?.id) {
      setValue("bed_name", selectedRow.original?.name || "");
      setValue("kelas_name", selectedRow.original?.kelas_id?.name || "");
    }
  }, [selectedRowHistori, selectedRow]);

  return (
    <>
      <div className="flex flex-col w-full ">
        <div
          className={`min-h-[16vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm`}
        >
          <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
            id pasien
          </div>
          <div className="p-4">
            <DynamicFormFields
              fields={fields}
              control={control}
              errors={errors}
              gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-2">
          <Button
            type="button"
            variant="red1"
            className="border-2 border-red2"
            size="sm"
            onClick={() => {
              setSelectedRow({});
              setSelectedRowHistori({});
              reset(defaultFormValuesHistoriBed);
            }}
          >
            <Icon icon="fluent:arrow-sync-12-filled" />
            Reset
          </Button>
          <Button
            type="submit"
            variant="primary3"
            size="sm"
            onClick={handleSubmit(onSubmit)}
          >
            <Icon icon="material-symbols:save-outline" className="text-white" />
            Simpan
          </Button>
        </div>
      </div>
    </>
  );
};

export default HistoriBedForm;
