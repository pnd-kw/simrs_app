import { postPoliklinik, updatePoliklinik } from "@/api/master/poliklinik";
import DynamicFormFields from "@/components/DynamicFormView";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useDialog from "@/hooks/ui/use-dialog";
import { usePoliklinikStore } from "@/stores/master/useMasterStore";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DialogPoliklinik from "./DialogPoliklinik";
import {
  getPoliklinikCheckboxes,
  getPoliklinikFields,
  poliklinikSchema,
} from "./PoliklinikFields";
import { useCreate } from "@/hooks/mutation/use-create";

const PoliklinikForm = () => {
  const { selectedRow, setSelectedRow } = usePoliklinikStore();
  const [selectedRowBridge, setSelectedRowBridge] = useState({});
  const { open } = useDialog();

  const defaultFormValues = {
    name: "",
    no_poli: "",
    poli_schedule_id: 0,
    code: "",
    kodebridge: "",
    remark: "",
    status: true,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(poliklinikSchema),
    defaultValues: defaultFormValues,
  });

  const { mutate } = useCreate({
    apiFn: postPoliklinik,
    queryKey: "poliklinik",
    successMessage: "Berhasil membuat loket.",
    errorMessage: "Gagal membuat loket.",
  });

  const fields = getPoliklinikFields();
  const checkbox = getPoliklinikCheckboxes();

  const onSubmit = async (data) => {
    try {
      if (selectedRow.id) {
        await updatePoliklinik({
          ...data,
          id: selectedRow.id,
        });
        setSelectedRow({});
        reset(defaultFormValues);
      } else {
        mutate(data);
        setSelectedRow({});
        reset(defaultFormValues);
      }
    } catch (err) {
      console.error("Gagal simpan Poliklinik:", err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal simpan Poliklinik",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (selectedRow?.id) {
      setValue("name", selectedRow.nama);
      setValue("no_poli", selectedRow.no_poli);
      setValue("code", selectedRow.kode);
      setValue("kodebridge", selectedRow.kode_bridge);
      setValue("remark", selectedRow.catatan);
    }
  }, [selectedRow, setValue]);

  useEffect(() => {
    if (selectedRowBridge?.kode_bridge) {
      setValue("kodebridge", selectedRowBridge.kode_bridge || "");
    }
  }, [selectedRowBridge, setValue]);

  return (
    <Card className="p-6 w-full mx-auto space-y-6">
      <div className="gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <DynamicFormFields
              checkboxes={checkbox}
              control={control}
              errors={errors}
            />
          </div>

          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-12">
              <DynamicFormFields
                fields={fields}
                control={control}
                errors={errors}
              />
            </div>
            <div className="col-span-6">
              <label htmlFor="kodebridge" className="label-style">
                kode bridge
              </label>
              <div className="relative">
                <Input
                  {...register("kodebridge")}
                  placeholder="Pilih Bridge"
                  disabled
                  className="rounded-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="absolute right-1 top-1/2 -translate-y-1/2 z-8 cursor-pointer"
                  onClick={() =>
                    open({
                      contentTitle: "Bridge",
                      component: DialogPoliklinik,
                      props: {
                        onSelectedRowChange: setSelectedRowBridge,
                        onCloseDialog: () => setIsDialogOpen(false),
                      },
                    })
                  }
                >
                  <Icon icon="mingcute:search-line" className="text-primary1" />
                </Button>
              </div>
            </div>

            <div className="col-span-6">
              <label htmlFor="remark" className="label-style">
                catatan
              </label>
              <Input
                {...register("remark")}
                placeholder="Catatan"
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-b" />

      <div className="flex justify-between">
        <Button
          variant="destructive"
          className="rounded-sm"
          onClick={() => {
            setSelectedRow({});
            setSelectedRowBridge({});
            reset(defaultFormValues);
          }}
        >
          Reset
        </Button>
        <Button
          className="bg-primary1 rounded-sm"
          onClick={handleSubmit(onSubmit)}
        >
          Simpan
        </Button>
      </div>
    </Card>
  );
};

export default PoliklinikForm;
