import {
  postJadwalDokter,
  updateJadwalDokter,
} from "@/api_disabled/master/jadwalDokter";
import DynamicFormFields from "@/components/DynamicFormView";
import ReusableComboboxZod from "@/components/ReusableComboboxZod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useDialog from "@/hooks/ui/use-dialog";
import {
  useJadwalDokterStore,
  useListLayananStore,
  useListPoliklinikStore,
} from "@/stores/master/useMasterStore";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import JadwalDokterDialogForm from "./JadwalDokterDialogForm";
import {
  getDetailJadwalFields,
  getJadwalDokterCheckboxes,
  getJadwalDokterFields,
  jadwalDokterSchema,
  optionsHari,
} from "./JadwalDokterFields";
import JadwalDokterHFISDialogForm from "./JadwalDokterHFISDialogForm";

const JadwalDokterForm = () => {
  const { listLayanan, fetchListLayanan } = useListLayananStore();
  const { listPoliklinik, fetchListPoliklinik } = useListPoliklinikStore();
  const { selectedRow, setSelectedRow } = useJadwalDokterStore();
  const [selectedRowDokter, setSelectedRowDokter] = useState({});
  const [selectedHFIS, setSelectedHFIS] = useState({});
  const { open } = useDialog();

  const defaultFormValues = {
    doctor_id: null,
    layanan_id: null,
    poli_code: null,
    day: "",
    time_start: "",
    time_finish: "",
    waktu_pelayanan_per_pasien: "",
    karakter_antrian: "",
    quota: 0,
    quota_jkn: 0,
    quota_vip: 0,
    status: true,
    bridging_hfis: false,
    status_jadwal: 1,
    name: "",
    spesialis: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(jadwalDokterSchema),
    defaultValues: defaultFormValues,
  });
  const optionsLinkLayanan = listLayanan.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const optionsLinkPoliklinik = listPoliklinik.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  const fields = getJadwalDokterFields(
    optionsLinkLayanan,
    optionsLinkPoliklinik
  );

  const detailJadwalField = getDetailJadwalFields();
  const checkbox = getJadwalDokterCheckboxes();

  const onSubmit = async (data) => {
    try {
      if (selectedRow.id) {
        await updateJadwalDokter({
          ...data,
          id: selectedRow.id,
        });
        setSelectedRow({});
        reset(defaultFormValues);
      } else {
        await postJadwalDokter(data);
        setSelectedRow({});
        reset(defaultFormValues);
      }

      toastWithProgress({
        title: "Berhasil",
        description: "Data Perusahaan berhasil disimpan.",
        type: "success",
      });
    } catch (err) {
      console.error("Gagal simpan Perusahaan:", err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal simpan Perusahaan",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (selectedRow?.id) {
      setValue("doctor_id", selectedRow.doctor_id ?? null);
      setValue("layanan_id", selectedRow.layanan_id ?? null);
      setValue("poli_code", selectedRow.poli_code ?? "");
      setValue("status_jadwal", selectedRow.status_jadwal ?? 1);
      setValue("day", selectedRow.hari ?? "");
      setValue("time_start", selectedRow.mulai ?? "");
      setValue("time_finish", selectedRow.selesai ?? "");
      setValue(
        "waktu_pelayanan_per_pasien",
        selectedRow.wkt_pelayanan_per_pasien?.toString() ?? ""
      );
      setValue("karakter_antrian", selectedRow.initial ?? "");
      setValue("quota", selectedRow.kuota ?? 0);
      setValue("quota_jkn", selectedRow.kuota_jkn ?? 0);
      setValue("quota_vip", selectedRow.kuota_vip ?? 0);
      setValue(
        "status",
        typeof selectedRow.status === "boolean" ? selectedRow.status : true
      );
      setValue("bridging_hfis", selectedRow.bridging_hfis ?? false);
      setValue("name", selectedRow.nama ?? "");
      setValue("spesialis", selectedRow.poliklinik ?? "");
    }
  }, [selectedRow, setValue]);

  useEffect(() => {
    if (selectedRowDokter?.id) {
      setValue("name", selectedRowDokter.nama || "");
      setValue("spesialis", selectedRowDokter.spesialis || "");
      setValue("karakter_antrian", selectedRowDokter.inisial || "");
      setValue("doctor_id", selectedRowDokter.id || "");
    }
  }, [selectedRowDokter, setValue]);

  useEffect(() => {
    if (selectedHFIS?.kodedokter) {
      const selectedHari = optionsHari.find(
        (item) => item.id === selectedHFIS.hari
      );

      setValue("day", selectedHari?.value || "");
      setValue("time_start", selectedHFIS.jadwal?.split("-")[0] || "");
      setValue("time_finish", selectedHFIS.jadwal?.split("-")[1] || "");
    }
  }, [selectedHFIS, setValue]);

  useEffect(() => {
    fetchListLayanan();
    fetchListPoliklinik();
  }, []);

  return (
    <Card className="p-6 w-full mx-auto space-y-6">
      <div className="gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2">
            <div>
              <p className="uppercase text-muted-foreground text-sm font-medium">
                ID Praktik Dokter
              </p>
              <p className="text-xl font-bold">{selectedRow.id || "-"}</p>
            </div>
            <div className="flex items-center justify-end">
              <DynamicFormFields
                checkboxes={checkbox}
                control={control}
                errors={errors}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-3">
              <label htmlFor="name" className="label-style">
                Dokter
              </label>
              <div className="relative">
                <Input
                  {...register("name")}
                  placeholder="Pilih Dokter"
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
                      contentTitle: "Dokter",
                      component: JadwalDokterDialogForm,
                      props: {
                        onSelectedRowChange: setSelectedRowDokter,
                        onCloseDialog: () => setIsDialogOpen(false),
                      },
                    })
                  }
                >
                  <Icon icon="mingcute:search-line" className="text-primary1" />
                </Button>
              </div>
              <span className="text-red-500 text-[10px] italic">
                WAJIB DIISI
              </span>
            </div>

            <div className="col-span-3">
              <label htmlFor="spesialis" className="label-style">
                spesialis
              </label>
              <Input
                {...register("spesialis")}
                placeholder="Spesialis"
                disabled
                className="rounded-md"
              />
            </div>

            <div className="col-span-6">
              <DynamicFormFields
                fields={fields}
                control={control}
                errors={errors}
              />
            </div>
            {selectedRow.id && (
              <div className="col-span-3">
                <label htmlFor="status_jadwal" className="label-style">
                  Status Jadwal
                </label>
                <Controller
                  control={control}
                  name="status_jadwal"
                  render={({ field }) => (
                    <ReusableComboboxZod
                      {...field}
                      placeholder="Pilih Status Jadwal"
                      options={[
                        { label: "Praktek", value: 1 },
                        { label: "Tidak Praktek", value: 2 },
                        { label: "Tutup", value: 3 },
                      ]}
                    />
                  )}
                />
                {errors.status_jadwal && (
                  <span className="text-red-500 text-[10px] italic">
                    {errors.status_jadwal.message}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="my-4">
          <div className="flex gap-4 items-center mb-2">
            <p className="font-bold uppercase">Detail Jadwal</p>
            <Button
              onClick={() =>
                open({
                  contentTitle: "Dokter",
                  component: JadwalDokterHFISDialogForm,
                  props: {
                    onSelectedRowChange: setSelectedHFIS,
                    onCloseDialog: () => setIsDialogOpen(false),
                  },
                })
              }
              className="text-xs rounded-sm bg-yellow1 font-semibold hover:bg-yellow-400 h-7 hover:cursor-pointer"
            >
              Lihat Jadwal HFIS
            </Button>
          </div>

          <DynamicFormFields
            fields={detailJadwalField}
            control={control}
            errors={errors}
          />
        </div>
      </div>

      <div className="border-b" />

      <div className="flex justify-between">
        <Button
          variant="destructive"
          className="rounded-sm"
          onClick={() => {
            setSelectedRow({});
            setSelectedRowDokter({});
            setSelectedHFIS({});
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

export default JadwalDokterForm;
