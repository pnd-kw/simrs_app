import DialogCariRekamMedis from "../../components/DialogCariRekamMedis";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useDialog from "@/hooks/ui/use-dialog";
import DatePicker from "@/utils/datePicker";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import z from "zod";
import DialogTutupKunjungan from "@/components/registrasi/components/DialogTutupKunjungan";
import DialogBatalKunjungan from "@/components/registrasi/components/DialogBatalKunjungan";
import DialogBukaKunjungan from "@/components/registrasi/components/DialogBukaKunjungan";
import { useFetchAsuransi } from "@/hooks/fetch/master_data/use-fetch-asuransi";
import { useFetchPerusahaanAsuransi } from "@/hooks/fetch/master_data/use-fetch-perusahaan-asuransi";
import { useFetchDoctor } from "@/hooks/fetch/master_data/use-fetch-doctor";
import { format } from "date-fns";
import DialogSep from "../../components/DialogSep";
import useReg from "@/hooks/store/use-reg";
import DialogProfilAndCreateSep from "../../components/DialogProfilAndCreateSep";
import useIgdRs from "@/hooks/kunjungan_igd/use-igd-rs";
import DialogTriage from "./DialogTriage";
import {
  createIgd,
  printAntrianIgd,
  printLabelIgd,
  updateIgd,
} from "@/api/registrasi/igd";
import { CARA_MASUK, SEBAB_SAKIT } from "../../ConstantsValue";
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
import { useCreate } from "@/hooks/mutation/use-create";

const kunjunganIgdSchema = z
  .object({
    id_antrian: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .optional(),
    rm_id: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .refine((val) => val !== "", { message: "No. RM wajib diisi" }),
    date: z
      .union([z.string(), z.date()])
      .transform((val) =>
        typeof val === "string" ? val : format(val, "yyyy-MM-dd HH:mm")
      )
      .refine((val) => val !== "", { message: "Tanggal wajib diisi" }),
    sebab_sakit: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .optional(),
    no_hp: z
      .string()
      .min(7, "No Telepon minimal 7 digit")
      .regex(/^[0-9]+$/, "No Telepon hanya boleh berupa angka"),
    nik: z.string().min(15, "NIK minimal 15 digit"),
    company_id: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .refine((val) => val !== "", {
        message: "Perusahaan asuransi wajib diisi",
      }),
    insurance_id: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .refine((val) => val !== "", { message: "Asuransi wajib diisi" }),
    insurance_no: z.string().optional().nullable(),
    norujukan: z.string().optional(),
    tanggal_rujukan: z
      .union([z.string(), z.date()])
      .transform((val) =>
        typeof val === "string" ? val : format(val, "yyyy-MM-dd")
      )
      .optional(),
    doctor_id: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .refine((val) => val !== "", { message: "Dokter wajib diisi" }),
    cara_masuk: z.string().optional(),
    remark: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { insurance_id, insurance_no, norujukan } = data;
    if (
      !insurance_id ||
      insurance_id === "" ||
      insurance_id === undefined ||
      insurance_id === null
    )
      return;
    if (insurance_id === "2") {
      if (!insurance_no || insurance_no.length < 13) {
        ctx.addIssue({
          path: ["insurance_no"],
          code: z.ZodIssueCode.custom,
          message: "Nomor Asuransi wajib diisi minimal 13 karakter untuk BPJS",
        });
      }
      const isRujukanValid =
        typeof norujukan === "string" && norujukan.length === 19;
      if (!isRujukanValid && !isKontrolValid) {
        ctx.addIssue({
          path: ["norujukan"],
          code: z.ZodIssueCode.custom,
          message:
            "No Rujukan atau No Kontrol wajib diisi salah satu dan harus 19 karakter",
        });
      }
    } else if (insurance_id !== "1") {
      if (!insurance_no || insurance_no.length < 8) {
        ctx.addIssue({
          path: ["insurance_no"],
          code: z.ZodIssueCode.custom,
          message: "Nomor Asuransi wajib diisi dan minimal 8 karakter",
        });
      }
    }
  });

const KunjunganIgdForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(kunjunganIgdSchema),
    defaultValues: {
      date: new Date(),
      sebab_sakit: 0,
      company_id: "",
      insurance_id: "",
      cara_masuk: "other",
      doctor_id: "",
      remark: "-",
      validasi_bpjs: true,
    },
    mode: "onSubmit",
  });

  const { open } = useDialog();

  const { data: asuransi } = useFetchAsuransi();
  const { data: perusahaanAsuransi } = useFetchPerusahaanAsuransi();
  const { data: dokterList } = useFetchDoctor();

  const [selectedTriage, setSelectedTriage] = useState({});

  const { igdRsData, setIgdRsData } = useIgdRs();

  const nikNumber = useWatch({ control, name: "nik" });
  const insuranceNo = useWatch({ control, name: "insurance_no" });
  const noSep = useWatch({ control, name: "no_sep" });

  const [idKunjungan, setIdKunjungan] = useState(null);

  const { setDataReg } = useReg();

  const [statusKunjungan, setStatusKunjungan] = useState(false);
  const [isKunjunganTertutup, setIsKunjunganTertutup] = useState(false);
  const [isTableIgdDataSource, setIsTableIgdDataSource] = useState(false);

  const { mutate: mutateCreateIgd } = useCreate({
    queryKey: "kunjungan igd",
    apiFn: createIgd,
    successMessage: "Berhasil membuat kunjungan igd.",
    errorMessage: "Gagal membuat kunjungan igd.",
  });

  const { mutate: mutateUpdateIgd } = useCreate({
    queryKey: "kunjungan igd",
    apiFn: updateIgd,
    successMessage: "Berhasil memperbarui kunjungan igd.",
    errorMessage: "Gagal memperbarui kunjungan.",
  });

  useEffect(() => {
    if (selectedTriage && Object.keys(selectedTriage).length > 0) {
      setValue("triage", selectedTriage.nama);
      setValue("doctor_id", selectedTriage.doctor_id);
    }
  }, [selectedTriage, setValue]);

  useEffect(() => {
    if (igdRsData && Object.keys(igdRsData).length > 0) {
      if (igdRsData.id_kunjungan) {
        setIdKunjungan(igdRsData.id_kunjungan);
      }

      if (igdRsData.status_kunjungan) {
        setStatusKunjungan(igdRsData.status_kunjungan); // Untuk menampilkan tombol buka atau tutup kunjungan
      }

      if (igdRsData.data_source === "table igd") {
        setIsTableIgdDataSource(true);
      }

      setDataReg({
        id_registration: igdRsData.id_kunjungan,
        nama: igdRsData.nama_rm,
        doctor_id: igdRsData.doctor_id,
        no_asuransi: igdRsData.insurance_no || 0,
      });

      const baseValues = {
        date: igdRsData.date,
        rm_id: igdRsData.no_rm,
        nama: igdRsData.nama_rm || igdRsData.nama,
        gender: igdRsData.jenis_kelamin,
        age: igdRsData.umur,
        no_hp: igdRsData.no_hp,
        telepon: igdRsData.telepon,
        alamat: igdRsData.alamat,
        pekerjaan: igdRsData.occupation,
        penanggung: igdRsData.penanggung,
        nik: igdRsData.nik,
        company_id: igdRsData.company_id,
        insurance_id: igdRsData.insurance_id,
        insurance_no: igdRsData.insurance_no,
      };

      if (igdRsData.data_source === "rekam medis") {
        reset({
          ...baseValues,
          triage: "",
          doctor_id: "",
        });
      }
      if (igdRsData.data_source === "table igd") {
        reset({
          ...baseValues,
          triage: igdRsData.id_triage,
          doctor_id: igdRsData.doctor_id,
        });
      }
    }
  }, [igdRsData]);

  const onSubmit = async (data) => {
    let idTriage;
    if (selectedTriage) {
      idTriage = selectedTriage.id_triage;
    }
    if (igdRsData.id_kunjungan) {
      mutateUpdateIgd({ ...data, id: igdRsData.id_kunjungan });
    } else {
      mutateCreateIgd({ ...data, id_triage: idTriage || "" });
    }
  };

  const cetakLabelIgd = async (params) => {
    try {
      const res = await printLabelIgd(params);
      const htmlContent = res.data;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Failed to post cetak antrian request", error);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mencetak label antrian kunjungan.",
        duration: 3000,
        type: "error",
      });
    }
  };

  const cetakAntrianIgd = async (params) => {
    try {
      const res = await printAntrianIgd(params);
      const htmlContent = res.data;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Failed to post cetak antrian request", error);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mencetak antrian kunjungan rawat jalan.",
        duration: 3000,
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex w-full min-h-[2vh] items-center justify-between">
        <div className="flex max-w-[10vw]">
          <span className="text-xs uppercase text-stone-600">id kunjungan</span>
        </div>
        <Button
          type="button"
          variant="primaryGradient"
          onClick={() =>
            open({
              contentTitle: "Kunjungan Baru",
              component: DialogCariRekamMedis,
              props: {
                onSelectedRowChange: setIgdRsData,
                parentComponent: "igd",
              },
            })
          }
          className="capitalize rounded-md text-xs"
        >
          <Icon icon="mdi:user" />
          kunjungan baru
        </Button>
      </div>
      <div className="flex w-full max-h-[10vh]">
        {igdRsData?.id_kunjungan ? (
          <span className="text-3xl ">{igdRsData?.id_kunjungan}</span>
        ) : (
          <span className="text-3xl ">-</span>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-4 gap-4 pb-4">
          <div>
            <div className="flex min-h-6 items-center justify-between">
              <label
                htmlFor="date"
                className="label-style"
                style={{ fontSize: 9 }}
              >
                tanggal
              </label>
              <Button
                type="button"
                variant="text"
                size="text"
                onClick={() => setValue("date", new Date())}
                style={{ fontSize: 9 }}
              >
                Today
              </Button>
            </div>
            <DatePicker
              name="date"
              control={control}
              placeholder="dd / mm / yyyy HH.mm"
              showTime={true}
            />
          </div>
          <div>
            <label htmlFor="" className="label-style" style={{ fontSize: 9 }}>
              triage
            </label>
            <div className="relative">
              <Input
                {...register("triage")}
                placeholder="Pilih Triage"
                disabled
                className="text-stone-500 rounded-sm"
              />

              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-8 cursor-pointer"
                onClick={() =>
                  open({
                    contentTitle: "Triage",
                    component: DialogTriage,
                    props: {
                      onSelectedRowChange: setSelectedTriage,
                    },
                  })
                }
              >
                <Icon icon="mingcute:search-line" className="text-primary1" />
              </Button>
            </div>
          </div>
          <div>
            <label
              htmlFor="doctor_id"
              className="label-style"
              style={{ fontSize: 9 }}
            >
              dokter
            </label>
            <Controller
              name="doctor_id"
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
                        className={`w-full max-h-[5vh] rounded-md border border-stone-400 justify-between ${
                          errors.doctor_id
                            ? "border border-2 border-red-500"
                            : ""
                        }`}
                        style={{ fontSize: 12 }}
                      >
                        <span className="max-w-50 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                          {selected ? selected.name : "Pilih Dokter"}
                        </span>
                        <Icon
                          icon="dashicons:arrow-down"
                          className="size-5 text-stone-900 hover:text-stone-400"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[19vw] p-0">
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
            {errors.doctor_id && (
              <p
                className="pb-1 px-1 text-left text-red-500 font-semibold"
                style={{ fontSize: 9 }}
              >
                {errors.doctor_id.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="sebab_sakit"
              className="label-style"
              style={{ fontSize: 9 }}
            >
              sebab sakit
            </label>
            <Controller
              name="sebab_sakit"
              control={control}
              render={({ field }) => {
                const selected = SEBAB_SAKIT.find(
                  (item) => item.value === field.value
                );
                return (
                  <div className="relative flex items-center">
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger
                        className="w-full"
                        style={{ fontSize: 12 }}
                        icon={
                          <Icon
                            icon="dashicons:arrow-down"
                            className="size-5 text-stone-900 hover:text-stone-400"
                          />
                        }
                      >
                        <SelectValue placeholder="Pilih Sebab Sakit">
                          {selected?.key ?? "Pilih Sebab Sakit"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {SEBAB_SAKIT.map((item) => {
                            return (
                              <SelectItem
                                key={item.key}
                                value={item.value.toString()}
                              >
                                {item.key}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                );
              }}
            />
          </div>
        </div>
        <div
          className={`flex flex-col w-full min-h-[16vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm mb-4`}
        >
          <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
            data pasien
          </div>
          <div className="grid grid-cols-4 gap-2 px-2">
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  {errors.rm_id && (
                    <p
                      className="pb-1 px-1 text-left text-red-500 font-semibold"
                      style={{ fontSize: 9 }}
                    >
                      {errors.rm_id.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label htmlFor="rm_id" className="label-style">
                    no rm
                  </label>
                </div>
                <div className="relative w-3/4">
                  <Input
                    {...register("rm_id")}
                    placeholder="Pilih RM"
                    disabled
                    className={`font-semibold rounded-sm ${
                      errors.rm_id ? "border border-2 border-red-500" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4"></div>
              </div>
              <div className="flex items-center">
                <div className="w-1/5">
                  <label className="label-style">nama</label>
                </div>
                <div className="relative w-4/5">
                  <Input
                    {...register("nama")}
                    placeholder="Nama"
                    disabled
                    className="font-semibold rounded-md"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/3"></div>
                <div className="w-2/3"></div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label className="label-style">jenis kelamin</label>
                </div>
                <div className="relative w-2/3">
                  <Input
                    {...register("gender")}
                    placeholder="Jenis Kelamin"
                    className="font-semibold rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/6">
                  <label className="label-style">umur</label>
                </div>
                <div className="relative w-5/6">
                  <Input
                    {...register("age")}
                    placeholder="Umur"
                    disabled
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 px-2">
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  {errors.no_hp && (
                    <p
                      className="pb-1 px-1 text-left text-red-500 font-semibold"
                      style={{ fontSize: 9 }}
                    >
                      {errors.no_hp.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label className="label-style">no hp</label>
                </div>
                <div className="relative w-3/4">
                  <Input
                    {...register("no_hp")}
                    placeholder="No HP"
                    className={`rounded-md ${
                      errors.no_hp ? "border border-2 border-red-500" : ""
                    }`}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  <span className="px-1 text-red-500" style={{ fontSize: 8 }}>
                    Wajib diisi
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label className="label-style">telepon</label>
                </div>
                <div className="relative w-3/4">
                  <Input
                    {...register("telepon")}
                    placeholder="Telepon"
                    disabled
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label className="label-style">alamat</label>
                </div>
                <div className="relative w-3/4">
                  <Input
                    {...register("alamat")}
                    placeholder="Alamat"
                    disabled
                    className="font-semibold rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 px-2">
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label className="label-style">pekerjaan</label>
                </div>
                <div className="relative w-3/4">
                  <Input
                    {...register("pekerjaan")}
                    placeholder="Pekerjaan"
                    disabled
                    className="font-semibold rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label className="label-style">penanggung</label>
                </div>
                <div className="relative w-3/4">
                  <Input
                    {...register("penanggung")}
                    placeholder="Penanggung"
                    disabled
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  {errors.nik && (
                    <p
                      className="pb-1 px-1 text-left text-red-500 font-semibold"
                      style={{ fontSize: 9 }}
                    >
                      {errors.nik.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label className="label-style">nik</label>
                </div>
                <div className="relative w-3/4">
                  <Input
                    {...register("nik")}
                    placeholder="NIK"
                    disabled
                    className="font-bold rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col w-full min-h-[28vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm mb-4`}
        >
          <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
            asuransi
          </div>

          <div className="grid grid-cols-3 gap-2 px-2">
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  {errors.company_id && (
                    <p
                      className="pb-1 px-1 text-left text-red-500 font-semibold"
                      style={{ fontSize: 9 }}
                    >
                      {errors.company_id.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label htmlFor="company_id" className="label-style">
                    perusahaan
                  </label>
                </div>
                <div className="relative w-3/4">
                  <Controller
                    name="company_id"
                    control={control}
                    render={({ field }) => {
                      const [open, setOpen] = useState(false);
                      const selected = perusahaanAsuransi?.find(
                        (item) => item.id === field.value
                      );

                      return (
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={`w-full max-h-[5vh] rounded-md border border-stone-400 justify-between ${
                                errors.company_id
                                  ? "border border-2 border-red-500"
                                  : ""
                              }`}
                              style={{ fontSize: 12 }}
                            >
                              <span className="max-w-60 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                {selected ? selected.name : "Pilih Perusahaan"}
                              </span>
                              <Icon
                                icon="dashicons:arrow-down"
                                className="size-5 text-stone-900 hover:text-stone-400"
                              />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[19vw] p-0"
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
                              <CommandInput placeholder="Ketik nama perusahaan..." />
                              <CommandList>
                                <CommandEmpty>
                                  Perusahaan tidak ditemukan.
                                </CommandEmpty>
                                <CommandGroup>
                                  {perusahaanAsuransi?.map((item) => {
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
              </div>
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  <span className="px-1 text-red-500" style={{ fontSize: 9 }}>
                    Wajib diisi
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  {errors.insurance_id && (
                    <p
                      className="pb-1 px-1 text-left text-red-500 font-semibold"
                      style={{ fontSize: 9 }}
                    >
                      {errors.insurance_id.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label htmlFor="insurance_id" className="label-style">
                    asuransi
                  </label>
                </div>
                <div className="relative w-3/4">
                  <Controller
                    name="insurance_id"
                    control={control}
                    render={({ field }) => {
                      const [open, setOpen] = useState(false);
                      const selected = asuransi?.find(
                        (item) => item.id === field.value
                      );

                      return (
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={`w-full max-h-[5vh] rounded-md border border-stone-400 justify-between ${
                                errors.insurance_id
                                  ? "border border-2 border-red-500"
                                  : ""
                              }`}
                              style={{ fontSize: 12 }}
                            >
                              <span className="max-w-60 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                {selected ? selected.name : "Pilih Asuransi"}
                              </span>
                              <Icon
                                icon="dashicons:arrow-down"
                                className="size-5 text-stone-900 hover:text-stone-400"
                              />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[19vw] p-0"
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
                              <CommandInput placeholder="Ketik nama Asuransi..." />
                              <CommandList>
                                <CommandEmpty>
                                  Asuransi tidak ditemukan.
                                </CommandEmpty>
                                <CommandGroup>
                                  {asuransi?.map((item) => {
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
              </div>
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  <span className="px-1 text-red-500" style={{ fontSize: 8 }}>
                    Wajib diisi
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  {errors.insurance_no && (
                    <p
                      className="pb-1 px-1 text-left text-red-500 font-semibold"
                      style={{ fontSize: 9 }}
                    >
                      {errors.insurance_no.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label htmlFor="insurance_no" className="label-style">
                    no asuransi
                  </label>
                </div>
                <div className="relative w-3/4">
                  <Input
                    {...register("insurance_no")}
                    placeholder="No Asuransi"
                    className={`rounded-md ${
                      errors.insurance_no
                        ? "border border-2 border-red-500"
                        : ""
                    }`}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  <span className="px-1 text-red-500" style={{ fontSize: 8 }}>
                    Selain umum, wajib diisi
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 px-2">
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  {errors.norujukan && (
                    <p
                      className="pb-1 px-1 text-left text-red-500 font-semibold"
                      style={{ fontSize: 9 }}
                    >
                      {errors.norujukan.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label htmlFor="norujukan" className="label-style">
                    no rujukan
                  </label>
                </div>
                <div className="relative w-3/4">
                  <Input
                    {...register("norujukan")}
                    placeholder="No Rujukan"
                    className={`rounded-md ${
                      errors.norujukan ? "border border-2 border-red-500" : ""
                    }`}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  <span className="px-1 text-red-500" style={{ fontSize: 9 }}>
                    Jika BPJS, wajib diisi
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  {errors.cara_masuk && (
                    <p
                      className="pb-1 px-1 text-left text-xs text-red-500 font-semibold"
                      style={{ fontSize: 9 }}
                    >
                      {errors.cara_masuk.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label htmlFor="cara_masuk" className="label-style">
                    cara masuk
                  </label>
                </div>
                <div className="relative w-3/4">
                  <Controller
                    name="cara_masuk"
                    control={control}
                    render={({ field }) => {
                      const selected = CARA_MASUK.find(
                        (item) => item.value === field.value
                      );
                      return (
                        <div className="relative flex items-center">
                          <Select
                            value={field.value || ""}
                            onValueChange={(val) => field.onChange(val)}
                          >
                            <SelectTrigger
                              className={`w-full ${
                                errors.cara_masuk
                                  ? "border border-2 border-red-500"
                                  : ""
                              }`}
                              style={{ fontSize: 12 }}
                              icon={
                                <Icon
                                  icon="dashicons:arrow-down"
                                  className="size-5 text-stone-900 hover:text-stone-400"
                                />
                              }
                            >
                              <SelectValue placeholder="Pilih Cara Masuk">
                                {selected?.key ?? "Pilih Cara Masuk"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {CARA_MASUK.map((item) => {
                                  return (
                                    <SelectItem
                                      key={item.key}
                                      value={item.value}
                                    >
                                      {item.key}
                                    </SelectItem>
                                  );
                                })}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  <span className="px-1 text-red-500" style={{ fontSize: 8 }}>
                    Wajib diisi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isTableIgdDataSource && (
          <div className="flex w-full min-h-[12vh] items-center mb-2">
            <div className="flex flex-col w-2/3 h-full">
              <label htmlFor="no_sep" className="label-style">
                No SEP
              </label>
              <div className="flex gap-0">
                <div className="flex w-[85%]">
                  <Input
                    {...register("no_sep")}
                    placeholder="SEP"
                    className="rounded-md min-h-[8vh]"
                  />
                </div>
                <div className="flex w-[15%]">
                  <Button
                    type="button"
                    variant="skyBlue"
                    className="w-full min-h-[8vh]"
                    onClick={() =>
                      open({
                        contentTitle: "SEP",
                        component:
                          noSep && noSep !== ""
                            ? DialogProfilAndCreateSep
                            : DialogSep,
                        props: {
                          insuranceNo,
                          nikNumber,
                          noSep,
                          parentComponent: "igd",
                        },
                      })
                    }
                  >
                    sep
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col w-full space-y-2 mb-4">
          <Controller
            name="validasi_bpjs"
            control={control}
            render={({ field }) => (
              <div className="flex space-x-2">
                <Checkbox
                  id="validasi_bpjs"
                  checked={!!field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="validasi_bpjs"
                    className="flex items-center text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Validasi BPJS
                  </label>
                </div>
              </div>
            )}
          />

          <Textarea {...register("remark")} className="w-full shadow-md" />
        </div>
        <div className="flex w-full min-h-[5vh] items-center justify-between">
          <div className="flex min-w-[14vw] h-full items-center justify-center gap-2">
            {igdRsData?.id_kunjungan && (
              <>
                {isKunjunganTertutup || statusKunjungan ? (
                  <Button
                    type="button"
                    variant="lightBlue"
                    className="capitalize"
                    onClick={() =>
                      open({
                        minWidth: "min-w-[30vw]",
                        contentTitle: "Buka Kunjungan",
                        headerColor: "bg-red1",
                        component: DialogBukaKunjungan,
                        props: {
                          dialogImage: "/assets/exclamation-red-icon.svg",
                          idKunjungan: idKunjungan,
                          setIsKunjunganTertutup: setIsKunjunganTertutup,
                        },
                      })
                    }
                  >
                    buka kunjungan
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary3"
                    className="capitalize"
                    onClick={() =>
                      open({
                        minWidth: "min-w-[50vw]",
                        contentTitle: "Tutup Kunjungan",
                        component: DialogTutupKunjungan,
                        props: {
                          idKunjungan: idKunjungan,
                          setIsKunjunganTertutup: setIsKunjunganTertutup,
                        },
                      })
                    }
                  >
                    tutup kunjungan
                  </Button>
                )}
                <Button
                  type="button"
                  variant="red1"
                  className="capitalize"
                  onClick={() =>
                    open({
                      minWidth: "min-w-[50vw]",
                      contentTitle: "Batal Kunjungan",
                      component: DialogBatalKunjungan,
                      props: {
                        idKunjungan: idKunjungan,
                      },
                    })
                  }
                >
                  batal kunjungan
                </Button>
              </>
            )}
          </div>
          <div className="flex min-w-[14vw] h-full items-center justify-center gap-2">
            <Button
              type="button"
              variant="red1"
              size="sm"
              onClick={() => {
                reset({
                  date: new Date(),
                  triage: "",
                  sebab_sakit: 0,
                  rm_id: "",
                  nama: "",
                  gender: "",
                  age: "",
                  no_hp: "",
                  telepon: "",
                  alamat: "",
                  pekerjaan: "",
                  penanggung: "",
                  nik: "",
                  company_id: "",
                  insurance_id: "",
                  insurance_no: "",
                  cara_masuk: "other",
                  doctor_id: "",
                  remark: "-",
                  validasi_bpjs: true,
                });
                setIgdRsData({});
                setIdKunjungan(null);
                setStatusKunjungan(false);
                setIsTableIgdDataSource(false);
              }}
            >
              <Icon icon="fluent:arrow-sync-12-filled" />
              reset
            </Button>

            <Button type="submit" variant="primary3" size="sm">
              <Icon icon="material-symbols:save-outline" />
              {igdRsData?.id_kunjungan ? "update" : "simpan"}
            </Button>
          </div>
        </div>
      </form>
      {igdRsData?.id_kunjungan && (
        <div className="flex w-full min-h-[8vh] items-center justify-end gap-2 pt-2">
          <Button variant="outlinedGreen2">cetak manual sep</Button>
          <Button
            variant="outlinedGreen2"
            onClick={() => cetakLabelIgd(idKunjungan)}
          >
            cetak label
          </Button>
          <Button
            variant="outlinedGreen2"
            onClick={() => cetakAntrianIgd(idKunjungan)}
          >
            cetak antrian
          </Button>
        </div>
      )}
    </div>
  );
};

export default KunjunganIgdForm;
