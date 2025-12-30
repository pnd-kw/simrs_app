import { Input } from "@/components/ui/input";
import { useFetchDoctor } from "@/hooks/fetch/master_data/use-fetch-doctor";
import { useFetchPoliklinik } from "@/hooks/fetch/master_data/use-fetch-poliklinik";
import { Icon } from "@iconify/react";
import { Controller, useForm } from "react-hook-form";
import SepHistory from "./SepHistory";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DatePicker from "@/utils/datePicker";
import { useCreate } from "@/hooks/mutation/use-create";
import { createNoKontrol } from "@/api_disabled/registrasi/noKontrol";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const CreateNoRencanaKontrol = ({ insuranceNo, editData, isReset }) => {
  const { register, control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      tglRencanaKontrol: new Date(),
    },
  });

  const [selectedNoSep, setSelectedNoSep] = useState("");

  const { data: dokterList } = useFetchDoctor();
  const { data: poliklinik } = useFetchPoliklinik();

  const { mutate } = useCreate({
    queryKey: ["no kontrol", "daftar_no_kontrol"],
    apiFn: createNoKontrol,
    successMessage: "Berhasil membuat no kontrol.",
    errorMessage: "Gagal membuat no kontrol.",
  });

  useEffect(() => {
    if (!editData) return;
    if (!dokterList || !Array.isArray(dokterList)) return;

    const doctor = dokterList.find(
      (item) =>
        item.kode_bridge === editData.kodeDokter &&
        editData.poliTujuan.includes(item.spesialis_name)
    );

    setValue("noSuratKontrol", editData.noSuratKontrol);

    if (doctor && Object.keys(doctor).length > 0) {
      setValue("kodeDokter", doctor.id || "");
      setValue("poliklinik", doctor.poliklinik_id || "");
    }
  }, [editData, dokterList, setValue]);

  useEffect(() => {
    if (selectedNoSep) {
      setValue("noSep", selectedNoSep);
    }
  }, [selectedNoSep, setValue]);

  useEffect(() => {
    if (isReset) {
      reset({
        noSuratKontrol: "",
        noSep: "",
        kodeDokter: "",
        poliklinik: "",
        tglRencanaKontrol: new Date(),
      });
    }
  }, [isReset, reset]);

  const onSubmit = (formData) => {
    const dokterData = dokterList.find(
      (item) => item.id === formData.kodeDokter
    );

    const payload = {
      nomor_sep: formData.noSep,
      tgl_rencana_kontrol: format(formData.tglRencanaKontrol, "yyyy-MM-dd"),
      kode_dokter: dokterData.kode_bridge,
      kode_poli: dokterData.spec_code,
    };
    mutate(payload);
  };

  return (
    <div className="grid grid-cols-[1fr_3fr] gap-2 p-2">
      <div className="flex items-start justify-center pr-2">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-1">
          <div>
            <label
              htmlFor="noSuratKontrol"
              className="label-style"
              style={{ fontSize: 9 }}
            >
              no surat kontrol
            </label>
            <Input
              {...register("noSuratKontrol")}
              placeholder="No Surat Kontrol"
              className="rounded-md"
              disabled={true}
            />
          </div>
          <div>
            <label
              htmlFor="noSep"
              className="label-style"
              style={{ fontSize: 9 }}
            >
              sep
            </label>
            <Input
              {...register("noSep")}
              placeholder="Nomor SEP"
              className="rounded-md"
              disabled={true}
            />
          </div>
          <div>
            <label
              htmlFor="kodeDokter"
              className="label-style"
              style={{ fontSize: 9 }}
            >
              dokter
            </label>
            <Controller
              name="kodeDokter"
              control={control}
              render={({ field }) => {
                const [open, setOpen] = useState(false);
                const selected = dokterList?.find(
                  (item) => item.id === field.value
                );

                return (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full max-h-[5vh] rounded-md border border-stone-400 justify-between"
                        style={{ fontSize: 12 }}
                      >
                        <span className="max-w-35 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                          {selected ? selected.name : "Pilih Dokter"}
                        </span>
                        <Icon
                          icon="dashicons:arrow-down"
                          className="size-5 text-stone-900 hover:text-stone-400"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[16vw] p-0"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <Command
                        filter={(value, search) => {
                          return value
                            .toLowerCase()
                            .includes(search.toLowerCase())
                            ? 1
                            : 0;
                        }}
                      >
                        <CommandInput placeholder="Ketik nama dokter..." />
                        <CommandList>
                          <CommandEmpty>Dokter tidak ditemukan.</CommandEmpty>
                          <CommandGroup>
                            {dokterList?.map((item) => (
                              <CommandItem
                                key={item.id}
                                value={item.name}
                                onSelect={() => {
                                  field.onChange(item.id);
                                  setOpen(false);

                                  // Untuk perubahan reaktif poliklinik terhadap perubahan dokter
                                  const dokter = dokterList.find(
                                    (e) => e.id === item.id
                                  );

                                  const poli = poliklinik.find(
                                    (e) => e.id === dokter?.poliklinik_id
                                  );

                                  setValue("poliklinik", poli?.id);
                                }}
                                className={`${
                                  item.id === field.value
                                    ? "!bg-primary3 !text-white"
                                    : "aria-selected:!bg-primary3 aria-selected:!text-white"
                                } text-xs justify-between`}
                              >
                                {item.name}
                                <Icon
                                  icon="ic:baseline-check"
                                  className={`${
                                    item.id === field.value
                                      ? "opacity-100 text-white"
                                      : "opacity-0"
                                  }`}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
          </div>
          <div>
            <label
              htmlFor="poliklinik"
              className="label-style"
              style={{ fontSize: 9 }}
            >
              poliklinik
            </label>
            <Controller
              name="poliklinik"
              control={control}
              render={({ field }) => {
                const [open, setOpen] = useState(false);
                const selected = poliklinik?.find(
                  (item) => item.id === field.value
                );

                return (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full max-h-[5vh] rounded-md border border-stone-400 justify-between"
                        style={{ fontSize: 12 }}
                      >
                        <span className="max-w-35 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                          {selected ? selected.name : "Pilih Klinik"}
                        </span>
                        <Icon
                          icon="dashicons:arrow-down"
                          className="size-5 text-stone-900 hover:text-stone-400"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[16vw] p-0"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <Command
                        filter={(value, search) => {
                          return value
                            .toLowerCase()
                            .includes(search.toLowerCase())
                            ? 1
                            : 0;
                        }}
                      >
                        <CommandInput placeholder="Ketik nama klinik..." />
                        <CommandList>
                          <CommandEmpty>Klinik tidak ditemukan.</CommandEmpty>
                          <CommandGroup>
                            {poliklinik?.map((item) => {
                              return (
                                <CommandItem
                                  key={item.id}
                                  value={item.name}
                                  onSelect={() => {
                                    field.onChange(item.id);
                                    setOpen(false);
                                  }}
                                  className={`${
                                    item.id === field.value
                                      ? "!bg-primary3 !text-white"
                                      : "aria-selected:!bg-primary3 aria-selected:!text-white"
                                  } text-xs justify-between`}
                                >
                                  {item.name}
                                  <Icon
                                    icon="ic:baseline-check"
                                    className={`${
                                      item.id === field.value
                                        ? "opacity-100 text-white"
                                        : "opacity-0"
                                    }`}
                                  />
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
          </div>
          <div>
            <label
              htmlFor="tglRencanaKontrol"
              className="label-style"
              style={{ fontSize: 9 }}
            >
              tgl rencana kontrol
            </label>
            <DatePicker
              name="tglRencanaKontrol"
              control={control}
              triggerByIcon={true}
              disableBeforeToday={true}
            />
          </div>

          <div className="flex items-center justify-between min-h-[6vh] pt-2">
            <Button
              type="button"
              variant="red1"
              onClick={() =>
                reset({
                  noSuratKontrol: "",
                  noSep: "",
                  kodeDokter: "",
                  poliklinik: "",
                  tglRencanaKontrol: new Date(),
                })
              }
            >
              reset
            </Button>
            <Button
              type="submit"
              variant="primary1"
              onClick={() => {
                clearNoRujukan();
              }}
              className="capitalize"
            >
              simpan
            </Button>
          </div>
        </form>
      </div>
      <div className="flex min-h-[10vh] border-l border-stone-300 overflow-auto">
        <SepHistory
          insuranceNo={insuranceNo}
          setSelectedNoSep={setSelectedNoSep}
          isClose={false}
        />
      </div>
    </div>
  );
};

export default CreateNoRencanaKontrol;
