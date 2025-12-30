import {
  createRajal,
  getDataAntrian,
  getPeserta,
  printAntrianRajal,
  printLabelRajal,
  updateDataAntrian,
  updateRajal,
} from "@/api/registrasi/rajal";
import DialogCariRekamMedis from "../../components/DialogCariRekamMedis";
import DialogNoRujukan from "@/components/registrasi/components/DialogNoRujukan";
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
import useDataAntrian from "@/hooks/kunjungan_rawat_jalan/use-data-antrian";
import useRajalRs from "@/hooks/kunjungan_rawat_jalan/use-rajal-rs";
import useDialog from "@/hooks/ui/use-dialog";
import DatePicker from "@/utils/datePicker";
import { sortSchedule, translateDay } from "@/utils/schedule";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import z from "zod";
import StatusKirimAntrianOnline from "./StatusKirimAntrianOnline";
import { SkeletonBlock } from "@/utils/skeletonLoader";
import DialogTutupKunjungan from "@/components/registrasi/components/DialogTutupKunjungan";
import DialogBatalKunjungan from "@/components/registrasi/components/DialogBatalKunjungan";
import DialogBukaKunjungan from "@/components/registrasi/components/DialogBukaKunjungan";
import { useFetchJenisLayanan } from "@/hooks/fetch/master_data/use-fetch-jenis-layanan";
import { useFetchAsuransi } from "@/hooks/fetch/master_data/use-fetch-asuransi";
import { useFetchPerusahaanAsuransi } from "@/hooks/fetch/master_data/use-fetch-perusahaan-asuransi";
import { useFetchPoliklinik } from "@/hooks/fetch/master_data/use-fetch-poliklinik";
import { useFetchDoctor } from "@/hooks/fetch/master_data/use-fetch-doctor";
import { useFetchScheduleDoctor } from "@/hooks/fetch/master_data/use-fetch-schedule-doctor";
import { useFetchParams } from "@/hooks/fetch/use-fetch-params";
import { getJadwalDokter } from "@/api/master/jadwalDokter";
import { format } from "date-fns";
import { useUpdate } from "@/hooks/mutation/use-update";
import DialogSep from "../../components/DialogSep";
import useReg from "@/hooks/store/use-reg";
import DialogProfilAndCreateSep from "../../components/DialogProfilAndCreateSep";
import DialogCariBooking from "./DialogCariBooking";
import {
  CARA_MASUK,
  JENIS_ANTRIAN,
  JENIS_KUNJUNGAN,
  SEBAB_SAKIT,
} from "../../ConstantsValue";
import useNoRujukan from "@/hooks/store/use-no-rujukan";
import DialogNoKontrol from "../../components/DialogNoKontrol";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import useNoKontrol from "@/hooks/store/use-no-kontrol";
import { useCreate } from "@/hooks/mutation/use-create";
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

const kunjunganRajalSchema = z
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
    jenis_layanan_id: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .optional(),
    kelaskunjungan: z.string().optional(),
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
    insurance_no: z.string().optional(),
    jenis_kunjungan: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .optional(),
    norujukan: z.string().optional(),
    nokontrol: z.string().optional(),
    poli_layanan: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .refine((val) => val !== "", { message: "Jenis antrean wajib diisi" }),
    doctor_id: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .refine((val) => val !== "", { message: "Dokter wajib diisi" }),
    schedule_doctor_id: z
      .union([z.string(), z.number()])
      .transform((val) => String(val))
      .refine((val) => val !== "", { message: "Jadwal dokter wajib diisi" }),
    cara_masuk: z.string().optional(),
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

const KunjunganRajalForm = () => {
  const formKey = "rajal";
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(kunjunganRajalSchema),
    defaultValues: {
      date: new Date(),
      jenis_layanan_id: 3,
      kelaskunjungan: "Non Kelas",
      sebab_sakit: 0,
      company_id: "",
      insurance_id: "",
      jenis_kunjungan: "",
      cara_masuk: "other",
      poli_layanan: "1",
      doctor_id: "",
      schedule_doctor_id: "",
      poliklinik: "",
      remark: "-",
      validasi_bpjs: true,
      prioritas: false,
    },
    mode: "onSubmit",
  });

  const { open } = useDialog();
  const [isOpen, setIsOpen] = useState(false);
  const [insuranceNumberError, setInsuranceNumberError] = useState("");

  const { data: layanan } = useFetchJenisLayanan();
  const { data: asuransi } = useFetchAsuransi();
  const { data: perusahaanAsuransi } = useFetchPerusahaanAsuransi();
  const { data: poliklinik } = useFetchPoliklinik();
  const { data: dokterList } = useFetchDoctor();

  const { noRujukan, clearNoRujukan } = useNoRujukan(formKey);
  const { noKontrol, clearNoKontrol } = useNoKontrol(formKey);

  const doctorId = useWatch({ control, name: "doctor_id" });
  const { data: scheduleDoctorToday } = useFetchScheduleDoctor({
    queryKey: "jadwal dokter rajal hari ini",
    apiFn: getJadwalDokter,
    params: { date: format(new Date(), "yyyy-MM-dd"), doctor_id: doctorId },
  });

  const { data: scheduleDoctor } = useFetchScheduleDoctor({
    queryKey: "jadwal dokter rajal",
    apiFn: getJadwalDokter,
    params: { doctor_id: doctorId },
  });

  const [useScheduleDoctor, setUseScheduleDoctor] = useState([]);

  const {
    rajalRsData,
    setRajalRsData,
    setIsSuccessSubmitRajalRs,
    setIsSuccessUpdateRajalRs,
  } = useRajalRs();

  const { isSuccessGetDataAntrian } = useDataAntrian();

  const nikNumber = useWatch({ control, name: "nik" });
  const insuranceId = useWatch({ control, name: "insurance_id" });
  const companyId = useWatch({ control, name: "company_id" });
  const insuranceNo = useWatch({ control, name: "insurance_no" });
  const noSep = useWatch({ control, name: "no_sep" });
  const poliLayanan = useWatch({ control, name: "poli_layanan" });

  const { data: nik } = useFetchParams({
    queryKey: "nik",
    apiFn: getPeserta,
    params: insuranceNo,
    onErrorHandler: (err, message) => {
      setInsuranceNumberError(message);
    },
  });

  const [antrianNumber, setAntrianNumber] = useState("");
  const [idKunjungan, setIdKunjungan] = useState(null);

  const { setDataReg } = useReg();

  const { data: dataAntrian } = useFetchParams({
    queryKey: ["data antrian", idKunjungan],
    apiFn: getDataAntrian,
    params: idKunjungan ? `registration_id=${idKunjungan}` : null,
    auto: !!idKunjungan,
  });

  const { mutate: mutateCreateRajal } = useCreate({
    queryKey: "kunjungan rajal",
    apiFn: createRajal,
    successMessage: "Berhasil membuat kunjungan rawat jalan.",
    errorMessage: "Gagal membuat kunjungan rawat jalan.",
  });

  const { mutate: mutateUpdateRajal } = useCreate({
    queryKey: "kunjungan rajal",
    apiFn: updateRajal,
    successMessage: "Berhasil memperbarui kunjungan rawat jalan.",
    errorMessage: "Gagal memperbarui kunjungan rawat jalan.",
  });

  const { mutate: mutateUpdateAntrian } = useUpdate({
    queryKey: ["data antrian", idKunjungan],
    apiFn: updateDataAntrian,
    successMessage: "Update antrian JKN berhasil.",
    refetchOnSuccess: true,
  });

  const [isTableRajalDataSource, setIsTableRajalDataSource] = useState(false);
  const [isBookingDataSource, setIsBookingDataSource] = useState(false);
  const [isChangeSchedule, setIsChangeSchedule] = useState(false);
  const [statusKunjungan, setStatusKunjungan] = useState(false);
  const [isKunjunganTertutup, setIsKunjunganTertutup] = useState(false);

  const openDialog = () => setIsOpen(true);

  useEffect(() => {
    if (insuranceNo) setInsuranceNumberError("");
  }, [insuranceNo]);

  useEffect(() => {
    if (!rajalRsData || Object.keys(rajalRsData).length === 0) return;

    const buildAntrianNumber = `${rajalRsData.initial} - ${rajalRsData.no_antrian}`;

    if (rajalRsData.id_kunjungan) {
      setIdKunjungan(rajalRsData.id_kunjungan);
    }

    if (rajalRsData.data_source === "table rajal") {
      setAntrianNumber(buildAntrianNumber); // Untuk menampilkan nomor antrian
      setIsTableRajalDataSource(true);
      setIsBookingDataSource(false);
    }

    if (rajalRsData.data_source === "booking") {
      setAntrianNumber(buildAntrianNumber); // Untuk menampilkan nomor antrian
      setIsTableRajalDataSource(false);
      setIsBookingDataSource(true);
    }

    if (rajalRsData.data_source === "rekam medis") {
      setAntrianNumber("");
      setIsTableRajalDataSource(false);
      setIsBookingDataSource(false);
    }

    if (rajalRsData.status_kunjungan) {
      setStatusKunjungan(rajalRsData.status_kunjungan); // Untuk menampilkan tombol buka atau tutup kunjungan
    }

    setDataReg({
      id_registration: rajalRsData.id_kunjungan,
      nama: rajalRsData.nama_rm,
      doctor_id: rajalRsData.doctor_id,
      no_asuransi: rajalRsData.insurance_no || 0,
    });

    reset({
      date: rajalRsData.date,
      rm_id: rajalRsData.no_rm || "",
      nama: rajalRsData.nama_rm || rajalRsData.nama || "",
      gender: rajalRsData.jenis_kelamin || "",
      age: rajalRsData.umur || "",
      no_hp: rajalRsData.no_hp || "",
      telepon: rajalRsData.telepon || "",
      alamat: rajalRsData.alamat || "",
      pekerjaan: rajalRsData.occupation || "",
      penanggung: rajalRsData.penanggung || "",
      nik: rajalRsData.nik || "",
      company_id: rajalRsData.company_id || "",
      insurance_id: rajalRsData.insurance_id || "",
      insurance_no: rajalRsData.insurance_no || "",
      norujukan: rajalRsData.norujukan || "",
      nokontrol: rajalRsData.nokontrol || "",
      jenis_kunjungan: rajalRsData.jenis_kunjungan || "",
      cara_masuk: rajalRsData.cara_masuk || "",
      poli_layanan: rajalRsData.poli_layanan || "1",
      poliklinik: rajalRsData.poliklinik_id || "",
      doctor_id: rajalRsData.doctor_id || "",
      schedule_doctor_id: "", // dikosongkan sementara, akan diisi oleh effect lain
      no_sep: rajalRsData.no_sep || "",
    });
  }, [rajalRsData]);

  useEffect(() => {
    let dokter = null;

    if (doctorId) {
      dokter = dokterList?.find((item) => item.id === doctorId);
    }

    if (
      Object.keys(rajalRsData).length > 0 &&
      rajalRsData.data_source === "booking" &&
      doctorId
    ) {
      setUseScheduleDoctor(scheduleDoctor);
    }

    if (
      Object.keys(rajalRsData).length > 0 &&
      rajalRsData.data_source === "rekam medis" &&
      doctorId
    ) {
      setUseScheduleDoctor(scheduleDoctorToday);
      setValue("spesialis", dokter?.spesialis_name);
    }

    if (
      Object.keys(rajalRsData).length > 0 &&
      rajalRsData.data_source === "table rajal" &&
      doctorId
    ) {
      setUseScheduleDoctor(scheduleDoctorToday);
      setValue("spesialis", dokter?.spesialis_name);
    }

    if (Object.keys(rajalRsData).length === 0 && doctorId) {
      setUseScheduleDoctor(scheduleDoctorToday);
      setValue("spesialis", dokter?.spesialis_name);
    }

    if (rajalRsData.data_source === "table rajal") {
      const scheduleId = rajalRsData?.schedule_doctor_id;
      if (!scheduleId && scheduleDoctorToday.length === 0) return;

      const isScheduleAvailable = scheduleDoctorToday.some(
        (j) => j.id === scheduleId
      );

      if (isScheduleAvailable) {
        setValue("schedule_doctor_id", scheduleId);
      } else {
        setValue("schedule_doctor_id", "");
      }
    }

    if (rajalRsData.data_source === "booking") {
      const scheduleId = rajalRsData?.schedule_doctor_id;
      if (!scheduleId && scheduleDoctor.length === 0) return;

      const isScheduleAvailable = scheduleDoctor.some(
        (j) => j.id === scheduleId
      );

      if (isScheduleAvailable) {
        setValue("schedule_doctor_id", scheduleId);
      } else {
        setValue("schedule_doctor_id", "");
      }
    }
  }, [rajalRsData, doctorId, scheduleDoctorToday, scheduleDoctor, setValue]);

  useEffect(() => {
    if (noRujukan) {
      setValue("norujukan", noRujukan);
    }
  }, [noRujukan]);

  useEffect(() => {
    if (noKontrol) {
      setValue("nokontrol", noKontrol);
    }
  }, [noKontrol]);

  const handleUpdateDataAntrian = async (payload) => {
    mutateUpdateAntrian(payload);
  };

  const onSubmit = async (data) => {
    const jenisPesertaBpjs = nik?.data?.peserta?.jenisPeserta?.keterangan;

    const payload = {
      ...data,
      jenis_peserta: jenisPesertaBpjs || "",
    };

    const handleClear = () => {
      clearNoRujukan();
      clearNoKontrol();
    };

    if (rajalRsData.id_kunjungan) {
      mutateUpdateRajal(
        { id: rajalRsData.id_kunjungan, ...payload },
        {
          onSuccess: () => {
            setIsSuccessUpdateRajalRs(true);
            handleClear();
          },
        }
      );
    } else {
      mutateCreateRajal(payload, {
        onSuccess: () => {
          setIsSuccessSubmitRajalRs(true);
          handleClear();
        },
      });
    }
  };

  const cetakLabelRajal = async (params) => {
    try {
      const res = await printLabelRajal(params);
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

  const cetakAntrianRajal = async (params) => {
    try {
      const res = await printAntrianRajal(params);
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
    <>
      <div className="flex flex-col w-full h-full">
        <div className="flex w-full min-h-[2vh] items-center justify-between">
          <div className="flex max-w-[10vw]">
            <span className="text-xs uppercase text-stone-600">
              id kunjungan
            </span>
          </div>
          <div className="flex min-w-[20vw] gap-2">
            <Button
              type="button"
              variant="outlinedGreen2"
              onClick={() =>
                open({
                  contentTitle: "Booking",
                  component: DialogCariBooking,
                  props: {
                    onSelectedRowChange: setRajalRsData,
                  },
                })
              }
              className="capitalize"
            >
              <Icon icon="mingcute:search-line" />
              cari booking
            </Button>
            <Button
              type="button"
              variant="primaryGradient"
              onClick={() =>
                open({
                  contentTitle: "Kunjungan Baru",
                  component: DialogCariRekamMedis,
                  props: {
                    onSelectedRowChange: setRajalRsData,
                    parentComponent: "rajal",
                  },
                })
              }
              className="capitalize rounded-md text-xs"
            >
              <Icon icon="mdi:user" />
              kunjungan baru
            </Button>
          </div>
        </div>
        <div className="flex w-full max-h-[10vh]">
          {rajalRsData.id_kunjungan ? (
            <span className="text-3xl ">{rajalRsData.id_kunjungan}</span>
          ) : (
            <span className="text-3xl ">-</span>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-[1fr_1fr_auto_1fr_1fr] gap-4 items-stretch pb-4">
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
                jenis layanan
              </label>
              <Controller
                name="jenis_layanan_id"
                control={control}
                render={({ field }) => {
                  const selected = layanan?.find(
                    (item) => item.id === field.value
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
                        >
                          <SelectValue placeholder="Pilih Jenis Layanan">
                            {selected?.name ?? "Pilih Jenis Layanan"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {layanan?.map((item) => {
                              return (
                                <SelectItem
                                  key={item.id}
                                  value={item.id}
                                  className="text-xs"
                                >
                                  {item.name}
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
            <div className="flex items-end pt-[1.3rem]">
              <Button
                type="button"
                className="aspect-square bg-stone-600 rounded-md"
              >
                <Icon icon="token:get" />
              </Button>
            </div>
            <div>
              <label
                htmlFor="kelaskunjungan"
                className="label-style"
                style={{ fontSize: 9 }}
              >
                kelas kunjungan
              </label>
              <Input
                {...register("kelaskunjungan")}
                placeholder="Kelas Kunjungan"
                disabled
                className="rounded-md"
              />
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
                <div className="flex items-center"></div>
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
            <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm mb-2">
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
                                  {selected
                                    ? selected.name
                                    : "Pilih Perusahaan"}
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
                  <div className="w-2/8">
                    <label htmlFor="insurance_no" className="label-style">
                      no asuransi
                    </label>
                  </div>
                  <div className="relative w-5/8">
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
                  <div className="w-1/8 pl-2">
                    <Button
                      type="button"
                      variant="white"
                      size="sm"
                      className="cursor-pointer bg-primary1 rounded-sm cursor-pointer hover:opacity-80"
                      disabled={
                        !(
                          insuranceId == 2 &&
                          (companyId === 1 || companyId === 2) &&
                          insuranceNo
                        )
                      }
                      onClick={() => {
                        const nikFromBpjs = nik?.data?.peserta?.nik;
                        if (nikFromBpjs) {
                          setValue("nik", nikFromBpjs);
                        }
                      }}
                    >
                      <Icon icon="token:get" className="text-white" />
                    </Button>
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
                      className={`rounded-md ${
                        errors.norujukan ? "border border-2 border-red-500" : ""
                      }`}
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
                      className={`rounded-md ${
                        errors.nokontrol ? "border border-2 border-red-500" : ""
                      }`}
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
              <div className="grid grid-rows-3 max-h-[12vh]">
                <div className="flex items-center">
                  <div className="w-1/4"></div>
                  <div className="w-3/4">
                    {errors.jenis_kunjungan && (
                      <p
                        className="pb-1 px-1 text-left text-xs text-red-500 font-semibold"
                        style={{ fontSize: 9 }}
                      >
                        {errors.jenis_kunjungan.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/4">
                    <label htmlFor="jenis_kunjungan" className="label-style">
                      kunjungan
                    </label>
                  </div>
                  <div className="relative w-3/4">
                    <Controller
                      name="jenis_kunjungan"
                      control={control}
                      render={({ field }) => {
                        const selected = JENIS_KUNJUNGAN.find(
                          (item) => item.value === field.value
                        );
                        return (
                          <div className="relative flex items-center">
                            <Select
                              value={field.value?.toString() || ""}
                              onValueChange={(val) =>
                                field.onChange(Number(val))
                              }
                            >
                              <SelectTrigger
                                className={`w-full ${
                                  errors.jenis_kunjungan
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
                                <SelectValue placeholder="Pilih Jenis Kunjungan">
                                  {selected?.key ?? "Pilih Jenis Kunjungan"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {JENIS_KUNJUNGAN.map((item) => (
                                    <SelectItem
                                      key={item.key}
                                      value={item.value.toString()}
                                    >
                                      {item.key}
                                    </SelectItem>
                                  ))}
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
          <div className="flex w-full gap-4 mb-4">
            <div
              className={`flex flex-col ${
                antrianNumber === "" ? "w-full" : "w-2/3"
              } min-h-[32vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm`}
            >
              <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
                antrean
              </div>
              {isTableRajalDataSource && (
                <div className="flex w-full min-h-[2vh] items-center gap-2 px-2 pt-2">
                  <Checkbox
                    checked={isChangeSchedule}
                    onCheckedChange={(value) =>
                      setIsChangeSchedule(Boolean(value))
                    }
                  />
                  <span className="text-xs">Apakah ingin mengubah jadwal?</span>
                </div>
              )}
              <div
                className={`grid ${
                  isTableRajalDataSource || isBookingDataSource || antrianNumber
                    ? "grid-cols-2"
                    : "grid-cols-3"
                } min-h-[32vh] gap-2 items-center px-2`}
              >
                {(!isTableRajalDataSource || poliLayanan == 1) &&
                !isBookingDataSource ? (
                  <div className="grid grid-rows-3 max-h-[10vh]">
                    <div className="flex items-center">
                      <div className="w-1/3"></div>
                      <div className="w-2/3">
                        {errors.poli_layanan && (
                          <p
                            className="pb-2 px-1 text-left text-red-500 font-semibold"
                            style={{ fontSize: 9 }}
                          >
                            {errors.poli_layanan.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/3">
                        <label htmlFor="poli_layanan" className="label-style">
                          jenis antrean
                        </label>
                      </div>
                      <div className="relative w-2/3">
                        <Controller
                          name="poli_layanan"
                          control={control}
                          render={({ field }) => {
                            const selected = JENIS_ANTRIAN.find(
                              (item) => String(item.key) === field.value
                            );

                            return (
                              <div className="relative flex items-center">
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  disabled={
                                    isTableRajalDataSource && !isChangeSchedule
                                  }
                                >
                                  <SelectTrigger
                                    className={`w-full ${
                                      errors.poli_layanan
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
                                    <SelectValue placeholder="Jenis Antrean">
                                      {selected?.value ?? "Jenis antrean"}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {JENIS_ANTRIAN.map((item) => (
                                        <SelectItem
                                          key={item.key}
                                          value={item.key}
                                        >
                                          {item.value}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="grid grid-rows-3 max-h-[10vh]">
                  <div className="flex items-center">
                    <div className="w-1/3"></div>
                    <div className="w-2/3">
                      {errors.doctor_id && (
                        <p
                          className="pb-1 px-1 text-left text-red-500 font-semibold"
                          style={{ fontSize: 9 }}
                        >
                          {errors.doctor_id.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-1/3">
                      <label htmlFor="doctor_id" className="label-style">
                        dokter
                      </label>
                    </div>
                    <div className="relative w-2/3">
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
                                  disabled={
                                    (isTableRajalDataSource &&
                                      !isChangeSchedule) ||
                                    isBookingDataSource
                                  }
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
                              <PopoverContent className="w-[17vw] p-0">
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

                                            // Untuk perubahan reaktif poliklinik terhadap perubahan dokter
                                            const dokter = dokterList?.find(
                                              (e) => e.id === item.id
                                            );

                                            const poli = poliklinik?.find(
                                              (e) =>
                                                e.id === dokter?.poliklinik_id
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
                  </div>
                </div>
                <div className="grid grid-rows-3 max-h-[10vh]">
                  <div className="flex items-center">
                    <div className="w-1/3"></div>
                    <div className="w-2/3">
                      {errors.schedule_doctor_id && (
                        <p
                          className="pb-1 px-1 text-left text-red-500 font-semibold"
                          style={{ fontSize: 9 }}
                        >
                          {errors.schedule_doctor_id.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/3">
                      <label
                        htmlFor="schedule_doctor_id"
                        className="label-style"
                      >
                        jadwal dokter
                      </label>
                    </div>
                    <div className="relative w-2/3">
                      <Controller
                        name="schedule_doctor_id"
                        control={control}
                        render={({ field }) => {
                          const selected = useScheduleDoctor?.find(
                            (item) => item.id === field.value
                          );

                          return (
                            <div className="relative flex items-center">
                              <Select
                                value={field.value?.toString() || ""}
                                onValueChange={(val) =>
                                  field.onChange(Number(val))
                                }
                                disabled={
                                  (isTableRajalDataSource &&
                                    !isChangeSchedule) ||
                                  isBookingDataSource
                                }
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
                                    ) : scheduleDoctor.length === 0 ? (
                                      <SelectItem value="no-schedule" disabled>
                                        Tidak ada jadwal praktek hari ini
                                      </SelectItem>
                                    ) : (
                                      sortSchedule(useScheduleDoctor)?.map(
                                        (item) => (
                                          <SelectItem
                                            key={item.id}
                                            value={item.id}
                                          >
                                            {translateDay(item.day)}{" "}
                                            {item.start} -{item.finish}
                                          </SelectItem>
                                        )
                                      )
                                    )}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-rows-3 max-h-[10vh]">
                  <div className="flex items-center"></div>
                  <div className="flex items-center">
                    <div className="w-1/3">
                      <label htmlFor="poliklinik" className="label-style">
                        poliklinik
                      </label>
                    </div>
                    <div className="relative w-2/3">
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
                                  disabled={!isChangeSchedule}
                                  style={{ fontSize: 12 }}
                                >
                                  <span className="max-w-45 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                    {selected ? selected.name : "Pilih Klinik"}
                                  </span>
                                  <Icon
                                    icon="dashicons:arrow-down"
                                    className="size-5 text-stone-900 hover:text-stone-400"
                                  />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-[17vw] p-0"
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
                                    <CommandEmpty>
                                      Klinik tidak ditemukan.
                                    </CommandEmpty>
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
                      {/* <Controller
                        name="poliklinik"
                        control={control}
                        render={({ field }) => {
                          const selected = poliklinik?.find(
                            (item) => item.id === field.value
                          );
                          return (
                            <div className="relative flex items-center">
                              <Select
                                value={field.value?.toString() || ""}
                                onValueChange={(val) =>
                                  field.onChange(Number(val))
                                }
                                disabled={
                                  (isTableRajalDataSource &&
                                    !isChangeSchedule) ||
                                  isBookingDataSource
                                }
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
                                  <SelectValue placeholder="Pilih Poliklinik">
                                    <span className="max-w-50">
                                      {selected?.name ?? "Pilih Poliklinik"}
                                    </span>
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {poliklinik?.map((item) => {
                                      return (
                                        <SelectItem
                                          key={item.id}
                                          value={item.id.toString()}
                                        >
                                          {item.name}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          );
                        }}
                      /> */}
                    </div>
                  </div>
                </div>
                {(!isTableRajalDataSource || poliLayanan == 1) &&
                !isBookingDataSource ? (
                  <div className="grid grid-rows-3 max-h-[10vh]">
                    <div className="flex items-center">
                      <div className="w-1/3"></div>
                      <div className="w-2/3"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/3">
                        <label className="label-style">spesialis</label>
                      </div>
                      <div className="relative w-2/3">
                        <Input
                          {...register("spesialis")}
                          placeholder="Spesialis"
                          disabled
                          className="rounded-md text-stone-400"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-1/4"></div>
                      <div className="w-3/4"></div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            {antrianNumber !== "" && (
              <div className="flex w-1/3 min-h-[32vh] border rounded-md shadow-md">
                <div className="flex flex-col w-full">
                  <div className="flex w-full min-h-[4vh] items-center justify-center">
                    <span className="pt-6 capitalize font-semibold">
                      no antrean
                    </span>
                  </div>
                  <div className="flex w-full h-[75%] items-center justify-center">
                    <span className="font-bold text-6xl text-primary1">
                      {antrianNumber}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isTableRajalDataSource && (
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
                            parentComponent: "rajal",
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
            <div className="flex w-full gap-8">
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
                        className="flex items-center text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                      >
                        prioritas
                      </label>
                    </div>
                  </div>
                )}
              />
            </div>

            <Textarea {...register("remark")} className="w-full shadow-md" />
          </div>
          {isTableRajalDataSource ? (
            isSuccessGetDataAntrian ? (
              <SkeletonBlock />
            ) : (
              <StatusKirimAntrianOnline
                dataAntrian={dataAntrian}
                handleUpdateDataAntrian={handleUpdateDataAntrian}
                rajalRsData={rajalRsData}
              />
            )
          ) : null}
          <div className="flex w-full min-h-[5vh] items-center justify-between">
            <div className="flex min-w-[14vw] h-full items-center justify-center gap-2">
              {rajalRsData.id_kunjungan && (
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
                  // Reset form dengan default values
                  reset({
                    date: new Date(),
                    jenis_layanan_id: 3,
                    kelaskunjungan: "Non Kelas",
                    sebab_sakit: 0,
                    company_id: "",
                    insurance_id: "",
                    jenis_kunjungan: "",
                    cara_masuk: "other",
                    poli_layanan: "1",
                    doctor_id: "",
                    schedule_doctor_id: "",
                    poliklinik: "",
                    remark: "-",
                    validasi_bpjs: true,
                    prioritas: false,
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
                    insurance_no: "",
                    norujukan: "",
                    nokontrol: "",
                    spesialis: "",
                    no_sep: "",
                  });
                  // Reset state dari hooks
                  setRajalRsData({});
                  setAntrianNumber("");
                  setIsTableRajalDataSource(false);
                  setIsBookingDataSource(false);
                }}
              >
                <Icon icon="fluent:arrow-sync-12-filled" />
                reset
              </Button>

              <Button type="submit" variant="primary3" size="sm">
                <Icon icon="material-symbols:save-outline" />
                {rajalRsData.id_kunjungan ? "update" : "simpan"}
              </Button>
            </div>
          </div>
        </form>
        {rajalRsData.id_kunjungan && (
          <div className="flex w-full min-h-[8vh] items-center justify-end gap-2 pt-2">
            <Button variant="outlinedGreen2">cetak manual sep</Button>
            <Button
              variant="outlinedGreen2"
              onClick={() => cetakLabelRajal(idKunjungan)}
            >
              cetak label
            </Button>
            <Button
              variant="outlinedGreen2"
              onClick={() => cetakAntrianRajal(idKunjungan)}
            >
              cetak antrian
            </Button>
          </div>
        )}
      </div>

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

export default KunjunganRajalForm;
