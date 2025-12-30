import { getJadwalDokter } from "@/api_disabled/master/jadwalDokter";
import { printAntrianBooking, createBooking } from "@/api_disabled/registrasi/booking";
import DialogCancelBooking from "./DialogCancelBooking";
import DialogNoRujukan from "@/components/registrasi/components/DialogNoRujukan";
import StatusJknDialog from "@/components/registrasi/components/StatusJknDialog";
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
import useBookingRs from "@/hooks/booking_antrian_kunjungan/use-booking-rs";
import { useFetchAsuransi } from "@/hooks/fetch/master_data/use-fetch-asuransi";
import { useFetchDoctor } from "@/hooks/fetch/master_data/use-fetch-doctor";
import { useFetchPerusahaanAsuransi } from "@/hooks/fetch/master_data/use-fetch-perusahaan-asuransi";
import { useFetchScheduleDoctor } from "@/hooks/fetch/master_data/use-fetch-schedule-doctor";
import { useCreate } from "@/hooks/mutation/use-create";
import useDialog from "@/hooks/ui/use-dialog";
import DatePicker from "@/utils/datePicker";
import { translateDay, sortSchedule } from "@/utils/schedule";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import z from "zod";
import DialogCariRekamMedis from "../../components/DialogCariRekamMedis";
import DialogNoKontrol from "../../components/DialogNoKontrol";
import useNoRujukan from "@/hooks/store/use-no-rujukan";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import useNoKontrol from "@/hooks/store/use-no-kontrol";
import { useFetchParams } from "@/hooks/fetch/use-fetch-params";
import { getPeserta } from "@/api_disabled/registrasi/rajal";
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

const bookingAntrianKunjunganSchema = z
  .object({
    rm_id: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .refine((val) => val !== "", { message: "No. RM wajib diisi" }),
    nama: z.string().optional(),
    no_hp: z
      .string()
      .min(7, "No Telepon minimal 7 digit")
      .regex(/^[0-9]+$/, "No Telepon hanya boleh berupa angka"),
    nik: z.string().min(15, "NIK minimal 15 digit"),
    date: z
      .union([z.string(), z.date(), z.null()])
      .transform((val) => {
        if (val === null) return "";
        if (typeof val === "string") return val;
        return format(val, "yyyy-MM-dd");
      })
      .refine((val) => val !== "", { message: "Tanggal wajib diisi" }),
    insurance_id: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .refine((val) => val !== "", { message: "Asuransi wajib diisi" }),
    company_id: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .refine((val) => val !== "", {
        message: "Perusahaan asuransi wajib diisi",
      }),
    insurance_no: z.string().optional(),
    norujukan: z.string().optional(),
    nokontrol: z.string().optional(),
    doctor_id: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .refine((val) => val !== "", { message: "Dokter wajib diisi" }),
    schedule_doctor_id: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .refine((val) => val !== "", { message: "Jadwal dokter wajib diisi" }),
    remark: z.string().optional(),
    prioritas: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const { insurance_id, insurance_no, norujukan, nokontrol } = data;

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
      const isKontrolValid =
        typeof nokontrol === "string" && nokontrol.length === 19;

      if (!isRujukanValid && !isKontrolValid) {
        ctx.addIssue({
          path: ["norujukan"],
          code: z.ZodIssueCode.custom,
          message:
            "No Rujukan atau No Kontrol wajib diisi salah satu dan harus 19 karakter",
        });
        ctx.addIssue({
          path: ["nokontrol"],
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

const BookingAntrianKunjunganForm = () => {
  const formKey = "booking";
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(bookingAntrianKunjunganSchema),
    defaultValues: {
      insurance_id: "",
      schedule_doctor_id: "",
      remark: "-",
      prioritas: false,
    },
    mode: "onSubmit",
  });

  const { open } = useDialog();
  const [isOpen, setIsOpen] = useState(false);
  const [insuranceNumberError, setInsuranceNumberError] = useState("");

  const {
    bookingRsData,
    setBookingRsData,
    setIsSuccessSubmitBookingRs,
  } = useBookingRs();
  const { data: asuransi } = useFetchAsuransi();
  const { data: perusahaanAsuransi } = useFetchPerusahaanAsuransi();
  const { data: dokterList } = useFetchDoctor();
  const { mutate } = useCreate({
    queryKey: "booking",
    apiFn: createBooking,
    successMessage: "Berhasil membuat booking antrian kunjungan.",
    errorMessage: "Gagal membuat booking antrian kunjungan.",
  });
  const doctorId = useWatch({ control, name: "doctor_id" });
  const { data: scheduleDoctor } = useFetchScheduleDoctor({
    queryKey: "jadwal dokter booking",
    apiFn: getJadwalDokter,
    params: { doctor_id: doctorId },
  });

  const { noRujukan, clearNoRujukan } = useNoRujukan(formKey);
  const { noKontrol, clearNoKontrol } = useNoKontrol(formKey);

  const [selectedRow, setSelectedRow] = useState({}); // Untuk menampung data row rekam medis yang dipilih
  const [selectedDay, setSelectedDay] = useState(""); // Untuk menampung hari yang dipilih dalam schedule dokter
  const [antrianNumber, setAntrianNumber] = useState("");
  const insuranceNo = useWatch({ control, name: "insurance_no" });
  const idBooking = bookingRsData?.id_booking ?? "";
  const updatedTime = bookingRsData?.updated_time ?? "";

  const { data: nik } = useFetchParams({
    queryKey: "nik",
    apiFn: getPeserta,
    params: insuranceNo,
    onErrorHandler: (err, message) => {
      setInsuranceNumberError(message);
    },
  });

  const openDialog = () => setIsOpen(true);

  const selectedScheduleDoctor = useMemo(() => {
    return scheduleDoctor.find(
      (item) => item.id === watch("schedule_doctor_id")
    );
  }, [watch("schedule_doctor_id"), scheduleDoctor]);

  useEffect(() => {
    if (selectedScheduleDoctor?.day) {
      setSelectedDay(selectedScheduleDoctor.day);
    }
  }, [selectedScheduleDoctor]);

  useEffect(() => {
    if (insuranceNo) setInsuranceNumberError("");
  }, [insuranceNo]);

  useEffect(() => {
    if (selectedRow) {
      setValue("rm_id", selectedRow.id_rm || "");
      setValue("nama", selectedRow.nama_rm || "");
      setValue("no_hp", selectedRow.no_hp || "");
      setValue("nik", selectedRow.nik || "");
      setValue("insurance_no", selectedRow.insurance_no || "");
    }
  }, [selectedRow, setValue]);

  useEffect(() => {
    if (!bookingRsData) return;

    const antrian = bookingRsData.antrian;
    if (antrian) setAntrianNumber(antrian);

    reset({
      rm_id: bookingRsData?.id_rm || "",
      nama: bookingRsData?.nama || "",
      no_hp: bookingRsData?.no_hp || "",
      nik: bookingRsData?.nik || "",
      insurance_id: bookingRsData?.insurance_id || "",
      company_id: bookingRsData?.company_id || "",
      insurance_no: bookingRsData?.insurance_no || "",
      norujukan: bookingRsData?.no_rujukan || "",
      nokontrol: bookingRsData?.no_kontrol || "",
      doctor_id: bookingRsData?.doctor_id || "",
      schedule_doctor_id: "", // dikosongkan sementara, akan diisi oleh effect lain
      date: isNaN(new Date(bookingRsData?.tanggal_antrian))
        ? null
        : new Date(bookingRsData?.tanggal_antrian),
      prioritas: false,
    });
  }, [bookingRsData]);

  useEffect(() => {
    if (noRujukan) {
      setValue("norujukan", noRujukan);
    }
  }, [noRujukan, setValue]);

  useEffect(() => {
    if (noKontrol) {
      setValue("nokontrol", noKontrol);
    }
  }, [noKontrol, setValue]);

  useEffect(() => {
    if (!bookingRsData) return;

    const scheduleId = bookingRsData?.schedule_doctor_id;
    if (!scheduleId && scheduleDoctor.length === 0) return;

    const isScheduleAvailable = scheduleDoctor.some((j) => j.id === scheduleId);

    if (isScheduleAvailable) {
      setValue("schedule_doctor_id", scheduleId);
    } else {
      setValue("schedule_doctor_id", "");
    }
  }, [bookingRsData, scheduleDoctor, setValue]);

  const onSubmit = async (data) => {
    const formattedDate = format(new Date(data.date), "yyyy-MM-dd HH:mm:ss");
    const jenisPesertaBpjs = nik?.data?.peserta?.jenisPeserta?.keterangan;

    const payload = {
      ...data,
      date: formattedDate,
      jenis_peserta: jenisPesertaBpjs || "",
    };

    const handleClear = () => {
      clearNoRujukan();
      clearNoKontrol();
    };

    mutate(payload, {
      onSuccess: () => {
        setIsSuccessSubmitBookingRs(true);
        handleClear();
      },
    });
  };

  const cetakAntrianBooking = async (params) => {
    try {
      const res = await printAntrianBooking(params);
      const htmlContent = res.data;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Failed to post cetak antrian request", error);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mencetak booking antrian kunjungan.",
        duration: 3000,
        type: "error",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div
          className={`flex flex-col w-full min-h-[16vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm`}
        >
          <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
            data diri
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
                    pilih rm
                  </label>
                </div>
                <div className="relative w-3/4">
                  <Input
                    {...register("rm_id")}
                    placeholder="Pilih RM"
                    disabled
                    className={`rounded-sm ${
                      errors.rm_id ? "border border-2 border-red-500" : ""
                    } disabled:text-stone-400`}
                  />
                  {Object.keys(bookingRsData).length > 0 ? null : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-8 cursor-pointer"
                      onClick={() =>
                        open({
                          contentTitle: "Cari Rekam Medis",
                          component: DialogCariRekamMedis,
                          props: {
                            onSelectedRowChange: setSelectedRow,
                            parentComponent: "booking",
                          },
                        })
                      }
                    >
                      <Icon
                        icon="mingcute:search-line"
                        className="text-primary1"
                      />
                    </Button>
                  )}
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
                <div className="w-3/4"></div>
              </div>
              <div className="flex items-center">
                <div className="w-1/5">
                  <label htmlFor="nama" className="label-style">
                    nama
                  </label>
                </div>
                <div className="relative w-4/5">
                  <Input
                    {...register("nama")}
                    placeholder="Nama"
                    disabled
                    className="rounded-md disabled:text-stone-400"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4"></div>
              </div>
            </div>
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
                  <label className="label-style">telepon</label>
                </div>
                <div className="relative w-3/4">
                  <Input
                    {...register("no_hp")}
                    placeholder="No Telepon"
                    disabled={Object.keys(bookingRsData).length > 0}
                    className={`rounded-md ${
                      errors.no_hp ? "border border-2 border-red-400" : ""
                    } ${
                      Object.keys(bookingRsData).length > 0
                        ? "text-stone-500"
                        : ""
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
              <div className="flex items-center">
                <div className="w-1/6"></div>
                <div className="w-5/6">
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
                <div className="w-1/6">
                  <label className="label-style">nik</label>
                </div>
                <div className="relative w-5/6">
                  <Input
                    {...register("nik")}
                    placeholder="NIK"
                    disabled
                    className={`rounded-md ${
                      errors.nik ? "border border-2 border-red-500" : ""
                    } disabled:text-stone-400`}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/6"></div>
                <div className="w-5/6">
                  <span className="px-1 text-red-500" style={{ fontSize: 8 }}>
                    Jika kosong, silahkan cek profile rekam medis
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col w-full min-h-[28vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm`}
        >
          <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
            asuransi
          </div>
          <div className="grid grid-cols-3 gap-2 px-2">
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
                              <CommandInput placeholder="Ketik nama asuransi..." />
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
                    Wajib diisi - Jika umum pilih UMUM
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-rows-4 max-h-[13vh]">
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
                    disabled={Object.keys(bookingRsData).length > 0}
                    className={`rounded-md ${
                      errors.insurance_no
                        ? "border border-2 border-red-500"
                        : ""
                    } disabled:text-stone-400`}
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
              <div className="flex items-center">
                <div className="w-1/4"></div>
                <div className="w-3/4">
                  {insuranceNumberError && (
                    <span
                      className="px-1 text-red-500 font-semibold"
                      style={{ fontSize: 9 }}
                    >
                      {insuranceNumberError} (jika non BPJS abaikan error ini)
                    </span>
                  )}
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
                    disabled={Object.keys(bookingRsData).length > 0}
                    className={`rounded-md ${
                      errors.norujukan ? "border border-2 border-red-500" : ""
                    } disabled:text-stone-800 disabled:bg-gray-100`}
                  />
                  <Button
                    type="button"
                    variant="white"
                    size="xs"
                    className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer bg-primary1 rounded-sm cursor-pointer hover:opacity-80"
                    onClick={() =>
                      open({
                        contentTitle: "No Rujukan Klinik",
                        component: DialogNoRujukan,
                        props: {
                          insuranceNo,
                          formKey: formKey,
                        },
                      })
                    }
                  >
                    <Icon icon="token:get" className="text-white" />
                  </Button>
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
                  {errors.nokontrol && (
                    <p
                      className="pb-1 px-1 text-left text-xs text-red-500 font-semibold"
                      style={{ fontSize: 9 }}
                    >
                      {errors.nokontrol.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label htmlFor="nokontrol" className="label-style">
                    no kontrol
                  </label>
                </div>
                <div className="relative w-3/4">
                  <Input
                    {...register("nokontrol")}
                    placeholder="No Kontrol"
                    disabled={Object.keys(bookingRsData).length > 0}
                    className={`rounded-md ${
                      errors.nokontrol ? "border border-2 border-red-500" : ""
                    } disabled:text-stone-800 disabled:bg-gray-100`}
                  />
                  <Button
                    type="button"
                    variant="white"
                    size="xs"
                    className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer bg-primary1 rounded-sm cursor-pointer hover:opacity-80"
                    onClick={openDialog}
                  >
                    <Image
                      src="/assets/dialog-trigger-icon.svg"
                      alt="dialog trigger icon"
                      width={16}
                      height={24}
                      className="object-contain"
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col w-full min-h-[16vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm`}
        >
          <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
            jadwal dokter
          </div>
          <div className="grid grid-cols-3 gap-2 px-2">
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div>
                {errors.doctor_id && (
                  <p
                    className="pt-2 px-1 text-left text-red-500 font-semibold"
                    style={{ fontSize: 9 }}
                  >
                    {errors.doctor_id.message}
                  </p>
                )}
              </div>
              <div>
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
                            <span className="max-w-80 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                              {selected ? selected.name : "Pilih Dokter"}
                            </span>
                            <Icon
                              icon="dashicons:arrow-down"
                              className="size-5 text-stone-900 hover:text-stone-400"
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[26vw] p-0">
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
                              <CommandEmpty>
                                Dokter tidak ditemukan.
                              </CommandEmpty>
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
              </div>
              <div>
                <span className="px-1 text-red-500" style={{ fontSize: 8 }}>
                  Wajib diisi
                </span>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div>
                {errors.schedule_doctor_id && (
                  <p
                    className="pt-2 px-1 text-left text-red-500 font-semibold"
                    style={{ fontSize: 9 }}
                  >
                    {errors.schedule_doctor_id.message}
                  </p>
                )}
              </div>
              <div>
                <Controller
                  name="schedule_doctor_id"
                  control={control}
                  render={({ field }) => {
                    const selected = scheduleDoctor?.find(
                      (item) => item.id === field.value
                    );
                    return (
                      <div className="relative flex items-center">
                        <Select
                          value={field.value?.toString() || ""}
                          onValueChange={(val) => field.onChange(Number(val))}
                        >
                          <SelectTrigger
                            className={`w-full ${
                              errors.schedule_doctor_id
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
                            <SelectValue placeholder="Pilih">
                              {selected
                                ? `${translateDay(selected.day)} ${
                                    selected.start
                                  } - ${selected.finish}`
                                : "Pilih"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {!doctorId ? (
                                <SelectItem value="no-doctor" disabled>
                                  Pilih dokter terlebih dahulu
                                </SelectItem>
                              ) : (
                                sortSchedule(scheduleDoctor)?.map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    {translateDay(item.day)} {item.start} -
                                    {item.finish}
                                  </SelectItem>
                                ))
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  }}
                />
              </div>
              <div>
                <span className="px-1 text-red-500" style={{ fontSize: 8 }}>
                  Wajib diisi
                </span>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div>
                {errors.date && (
                  <p
                    className="pt-2 px-1 text-left text-red-500 font-semibold"
                    style={{ fontSize: 9 }}
                  >
                    {errors.date.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <DatePicker
                  control={control}
                  name="date"
                  placeholder="Tanggal"
                  schedule={translateDay(selectedDay)}
                  requireSchedule={true}
                  triggerByIcon={true}
                  showError={false}
                  className={`${
                    errors.date ? "border border-2 border-red-500" : ""
                  }`}
                />
              </div>
              <div>
                <span className="px-1 text-red-500" style={{ fontSize: 8 }}>
                  Wajib diisi
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex flex-col w-full space-y-2">
            <label
              htmlFor="remark"
              className="text-xs font-normal capitalize text-stone-900"
            >
              keterangan
            </label>
            <div className="flex w-full gap-4">
              <div className={`${antrianNumber === "" ? "w-full" : "w-2/3"}`}>
                <Textarea
                  {...register("remark")}
                  className="min-h-36 shadow-md"
                />
              </div>
              {antrianNumber !== "" && (
                <div className="flex w-1/3 border rounded-md shadow-md">
                  <div className="flex flex-col w-full space-y-2">
                    <div className="flex w-full min-h-[4vh] items-center justify-center">
                      <span className="py-2 capitalize font-semibold">
                        no antrean
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-center">
                      <span className="font-bold text-6xl text-primary1">
                        {antrianNumber}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex w-[20vw] gap-2">
            <Controller
              name="prioritas"
              control={control}
              render={({ field }) => (
                <div className="flex space-x-2">
                  <Checkbox
                    id="prioritas"
                    checked={!!field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="prioritas"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 uppercase"
                    >
                      pasien prioritas
                    </label>
                  </div>
                </div>
              )}
            />
          </div>

          <div className="flex justify-end">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="red1"
                className="border-2 border-red2"
                size="sm"
                onClick={() => {
                  reset();
                  setBookingRsData({});
                  setAntrianNumber("");
                }}
              >
                <Icon icon="fluent:arrow-sync-12-filled" />
                reset
              </Button>
              {Object.keys(bookingRsData).length === 0 ? (
                <Button type="submit" variant="primary3" size="sm">
                  <Icon icon="material-symbols:save-outline" />
                  simpan
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="red2"
                    size="sm"
                    onClick={() =>
                      open({
                        minWidth: "min-w-[50vw]",
                        contentTitle: "Cancel Booking",
                        component: DialogCancelBooking,
                        props: {
                          idBooking,
                        },
                      })
                    }
                  >
                    batal booking
                  </Button>
                  <Button
                    type="button"
                    variant="lightBlue"
                    size="sm"
                    onClick={() => cetakAntrianBooking(idBooking)}
                  >
                    cetak antrean
                  </Button>
                  <Button
                    type="button"
                    variant="primary3"
                    size="sm"
                    onClick={() =>
                      open({
                        minWidth: "min-w-[50vw]",
                        contentTitle: "Detail Booking JKN",
                        component: StatusJknDialog,
                        props: {
                          idBooking,
                          updatedTime,
                        },
                      })
                    }
                  >
                    status jkn
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-w-[70vw] max-h-[90vh] overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle></DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden>
            <DialogDescription></DialogDescription>
          </VisuallyHidden>
          <div className="flex items-center pl-10 bg-primary1 w-full h-[6vh] text-white font-semibold">
            No Kontrol
          </div>
          <DialogNoKontrol
            insuranceNo={insuranceNo}
            formKey={formKey}
            isDialogOpen={setIsOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingAntrianKunjunganForm;
