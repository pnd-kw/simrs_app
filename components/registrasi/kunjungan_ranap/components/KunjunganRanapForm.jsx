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
import useRanapRs from "@/hooks/kunjungan_rawat_inap/use-ranap-rs";

const caraMasuk = [
  {
    key: "Rujukan FKTP",
    value: "gp",
  },
  {
    key: "Rujukan FKRTL",
    value: "hosp-trans",
  },
  {
    key: "Rujukan Spesialis",
    value: "mp",
  },
  {
    key: "Dari Rawat Jalan",
    value: "outp",
  },
  {
    key: "Dari Rawat Inap",
    value: "inp",
  },
  {
    key: "Dari Rawat Darurat",
    value: "emd",
  },
  {
    key: "Lahir di RS",
    value: "born",
  },
  {
    key: "Rujukan Panti Jompo",
    value: "nursing",
  },
  {
    key: "Rujukan dari RS Jiwa",
    value: "psych",
  },
  {
    key: "Rujukan Fasilitas Rehab",
    value: "rehab",
  },
  {
    key: "Lain-lain",
    value: "other",
  },
];

const kunjunganRanapSchema = z
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
    tanggal_rujukan: z
      .union([z.string(), z.date()])
      .transform((val) =>
        typeof val === "string" ? val : format(val, "yyyy-MM-dd")
      )
      .optional(),
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

const KunjunganRanapForm = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(kunjunganRanapSchema),
    defaultValues: {
      date: new Date(),
      jenis_layanan_id: 3,
      kelaskunjungan: "Non Kelas",
      sebab_sakit: 0,
      company_id: "",
      insurance_id: "",
      jenis_kunjungan: "",
      cara_masuk: "other",
      poli_layanan: "",
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

  const { data: asuransi } = useFetchAsuransi();
  const { data: perusahaanAsuransi } = useFetchPerusahaanAsuransi();
  const { data: dokterList } = useFetchDoctor();


  const { ranapRsData, setRanapRsData } =
    useRanapRs();

  const nikNumber = useWatch({ control, name: "nik" });
  const insuranceNo = useWatch({ control, name: "insurance_no" });
  const noSep = useWatch({ control, name: "no_sep" });


  const [idKunjungan, setIdKunjungan] = useState(null);

  const { setDataReg } = useReg();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isChangeSchedule, setIsChangeSchedule] = useState(false);
  const [statusKunjungan, setStatusKunjungan] = useState(false);
  const [isKunjunganTertutup, setIsKunjunganTertutup] = useState(false);

  useEffect(() => {
    if (!ranapRsData || Object.keys(ranapRsData).length === 0) return;

    if (ranapRsData.doctor_id) {
      setIsEditMode(true);
    }

    if (ranapRsData.id_kunjungan) {
      setIdKunjungan(ranapRsData.id_kunjungan);
    }

    if (ranapRsData.status_kunjungan) {
      setStatusKunjungan(ranapRsData.status_kunjungan); // Untuk menampilkan tombol buka atau tutup kunjungan
    }

    setDataReg({
      id_registration: ranapRsData.id_kunjungan,
      nama: ranapRsData.nama_rm,
      doctor_id: ranapRsData.doctor_id,
      no_asuransi: ranapRsData.insurance_no || 0,
    });

    reset({
      rm_id: ranapRsData.id_rm || "",
      nama: ranapRsData.nama_rm || ranapRsData.nama || "",
      gender: ranapRsData.jenis_kelamin || "",
      age: ranapRsData.umur || "",
      no_hp: ranapRsData.no_hp || "",
      telepon: ranapRsData.telepon || "",
      alamat: ranapRsData.alamat || "",
      pekerjaan: ranapRsData.occupation || "",
      penanggung: ranapRsData.penanggung || "",
      nik: ranapRsData.nik || "",
      company_id: ranapRsData.company_id || "",
      insurance_id: ranapRsData.insurance_id || "",
      insurance_no: ranapRsData.insurance_no || "",
      norujukan: ranapRsData.norujukan || "",
      nokontrol: ranapRsData.nokontrol || "",
      jenis_kunjungan: ranapRsData.jenis_kunjungan || "",
      cara_masuk: ranapRsData.cara_masuk || "",
      poli_layanan: ranapRsData.poli_layanan || "",
      poliklinik: ranapRsData.poliklinik_id || "",
      doctor_id: ranapRsData.doctor_id || "",
      no_sep: ranapRsData.no_sep || "",
    });
  }, [ranapRsData]);


  const onSubmit = async (data) => {
    const payload = { ...data };
  };

  const cetakLabelRanap = async (params) => {
    try {
      const res = await printLabelRanap(params);
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

  const cetakAntrianRanap = async (params) => {
    try {
      const res = await printAntrianRanap(params);
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
          variant="yellow1"
          onClick={() =>
            open({
              contentTitle: "Kunjungan Baru",
              component: DialogCariRekamMedis,
              props: {
                onSelectedRowChange: setRanapRsData,
                parentComponent: "Ranap",
              },
            })
          }
          className="rounded-md text-xs border border-2 border-yellow2"
        >
          <Icon icon="material-symbols-light:data-table-outline" />
          spri
        </Button>
      </div>
      <div className="flex w-full max-h-[10vh]">
        {ranapRsData.id_kunjungan ? (
          <span className="text-3xl ">{ranapRsData.id_kunjungan}</span>
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
              kelas kunjungan
            </label>
            <div className="relative">
              <Input
                {...register("kelas_kunjungan")}
                placeholder="Pilih Kelas Kunjungan"
                disabled
                className="rounded-sm"
              />
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
                const selected = dokterList?.find(
                  (item) => item.id === field.value
                );
                return (
                  <div className="relative flex items-center">
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={(val) => {
                        field.onChange(Number(val));
                      }}
                      disabled={isEditMode && !isChangeSchedule}
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
                        <SelectValue placeholder="Pilih Dokter">
                          <span className="max-w-50">
                            {selected?.name ?? "Pilih Dokter"}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {dokterList?.map((item) => {
                            return (
                              <SelectItem key={item.id} value={item.id}>
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
            <label className="label-style" style={{ fontSize: 9 }}>spesialis</label>
            <Input
              {...register("spesialis")}
              placeholder="Spesialis"
              disabled
              className="rounded-md"
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
                    id rm
                  </label>
                </div>
                <div className="relative w-3/4">
                  <Input
                    {...register("rm_id")}
                    placeholder="Pilih RM"
                    disabled
                    className="font-semibold rounded-sm"
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
                <div className="w-1/4"></div>
                <div className="w-3/4"></div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/4">
                  <label className="label-style">gender</label>
                </div>
                <div className="relative w-3/4">
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
                    className="rounded-md"
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
                      const selected = perusahaanAsuransi?.find(
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
                              icon={
                                <Icon
                                  icon="dashicons:arrow-down"
                                  className="size-5 text-stone-900 hover:text-stone-400"
                                />
                              }
                            >
                              <SelectValue placeholder="Pilih Perusahaan">
                                {selected?.name ?? "Pilih Perusahaan"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {perusahaanAsuransi?.map((item) => {
                                  return (
                                    <SelectItem key={item.id} value={item.id}>
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
                      const selected = asuransi?.find(
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
                              icon={
                                <Icon
                                  icon="dashicons:arrow-down"
                                  className="size-5 text-stone-900 hover:text-stone-400"
                                />
                              }
                            >
                              <SelectValue placeholder="Pilih Asuransi">
                                {selected?.name ?? "Pilih Asuransi"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {asuransi?.map((item) => {
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
                    className="rounded-md"
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
                    className="rounded-md"
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
                    <p className="pb-1 px-1 text-left text-xs text-red-500 font-semibold" style={{ fontSize: 9 }}>
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
                      const selected = caraMasuk?.find(
                        (item) => item.value === field.value
                      );
                      return (
                        <div className="relative flex items-center">
                          <Select
                            value={field.value || ""}
                            onValueChange={(val) => field.onChange(val)}
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
                              <SelectValue placeholder="Pilih Cara Masuk">
                                {selected?.key ?? "Pilih Cara Masuk"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {caraMasuk.map((item) => {
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

        {Object.keys(ranapRsData).length > 0 && (
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

          <Textarea {...register("remarks")} className="w-full shadow-md" />
        </div>
        <div className="flex w-full min-h-[5vh] items-center justify-between">
          <div className="flex min-w-[14vw] h-full items-center justify-center gap-2">
            {ranapRsData.id_kunjungan && (
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
                reset();
                setRanapRsData({});
                setAntrianNumber("");
              }}
            >
              <Icon icon="fluent:arrow-sync-12-filled" />
              reset
            </Button>

            <Button type="submit" variant="primary3" size="sm">
              <Icon icon="material-symbols:save-outline" />
              {ranapRsData.id_kunjungan ? "update" : "simpan"}
            </Button>
          </div>
        </div>
      </form>
      {ranapRsData.id_kunjungan && (
        <div className="flex w-full min-h-[8vh] items-center justify-end gap-2 pt-2">
          <Button variant="outlinedGreen2">cetak manual sep</Button>
          <Button
            variant="outlinedGreen2"
            onClick={() => cetakLabelRanap(idKunjungan)}
          >
            cetak label
          </Button>
          <Button
            variant="outlinedGreen2"
            onClick={() => cetakAntrianRanap(idKunjungan)}
          >
            cetak antrian
          </Button>
        </div>
      )}
    </div>
  );
};

export default KunjunganRanapForm;
