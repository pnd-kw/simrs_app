import { getListKabupaten } from "@/api_disabled/master/kabupaten";
import { getListKecamatan } from "@/api_disabled/master/kecamatan";
import { getListProvinsi } from "@/api_disabled/master/provinsi";
import {
  getSepDetail,
  getSepHistory,
  createSep,
  cetakSep,
  getListDiagnosa,
  getSepBySep,
  getSepRencanaKontrol,
} from "@/api_disabled/registrasi/sep";
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
import { useFetchDoctor } from "@/hooks/fetch/master_data/use-fetch-doctor";
import { useFetchPoliklinik } from "@/hooks/fetch/master_data/use-fetch-poliklinik";
import { useFetchParams } from "@/hooks/fetch/use-fetch-params";
import { useFetchQuery } from "@/hooks/fetch/use-fetch-query";
import { useCreate } from "@/hooks/mutation/use-create";
import useReg from "@/hooks/store/use-reg";
import { useDownloadPdf } from "@/hooks/utility/useDownloadPdf";
import DatePicker from "@/utils/datePicker";
import {
  SkeletonCard,
  SkeletonControllerFieldValue,
  SkeletonFieldValue,
} from "@/utils/skeletonLoader";
import SearchField from "@/utils/table/searchField";
import { Table } from "@/utils/table/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { format, subMonths } from "date-fns";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import z from "zod";
import {
  ASAL_RUJUKAN,
  LAKA_LANTAS,
  SUPLESI,
  TUJUAN_KUNJUNGAN,
} from "../ConstantsValue";
import { useDebounce } from "@/hooks/utility/use-debounce";
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

const createSepSchema = z
  .object({
    asal_rujukan: z.string().optional(),
    tgl_sep: z
      .union([z.string(), z.date()])
      .transform((val) =>
        typeof val === "string" ? val : format(val, "yyyy-MM-dd")
      )
      .refine((val) => val !== "", { message: "Tanggal SEP wajib diisi" }),
    cob: z.string().optional(),
    katarak: z.string().optional(),
    jenis_pelayanan: z.string().optional(),
    doctor_id: z.number().optional(),
    kode_dpjp: z.string().optional(),
    dpjp_layanan: z.string().optional(),
    diagnosa_input: z.string().optional(),
    diagnosa_full: z.string().optional(),
    nomor_surat: z.string().min(19, "No rujukan minimal 19 karakter"),
    nomor_kartu: z.string().optional(),
    laka_lantas: z.string().min(1, "Laka lantas wajib diisi"),
    keterangan: z.string().optional(),
    suplesi: z.string().optional(),
    nomor_sep_suplesi: z.string().optional(),
    tgl_kejadian: z
      .union([z.string(), z.date()])
      .transform((val) =>
        typeof val === "string" ? val : format(val, "yyyy-MM-dd")
      )
      .refine((val) => val !== "", { message: "Tanggal kejadian wajib diisi" })
      .optional(),
    kode_propinsi: z.string().optional(),
    kode_kabupaten: z.string().optional(),
    kode_kecamatan: z.string().optional(),
    tujuan_kunjungan: z.string().optional(),
    flag_procedure: z.string().optional(),
    kode_penunjang: z.string().optional(),
    assesment_pel: z.string().optional(),
    eksekutif: z.string().optional(),
    catatan: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.laka_lantas === "1" || data.laka_lantas === "2") {
      if (!data.suplesi)
        ctx.addIssue({
          path: ["suplesi"],
          code: "custom",
          message: "Suplesi wajib diisi",
        });
      if (data.suplesi === "1" && !data.nomor_sep_suplesi) {
        ctx.addIssue({
          path: ["nomor_sep_suplesi"],
          code: "custom",
          message: "Nomor SEP Suplesi wajib diisi",
        });
      }
      if (!data.kode_propinsi)
        ctx.addIssue({
          path: ["kode_propinsi"],
          code: "custom",
          message: "Propinsi wajib diisi",
        });
      if (!data.kode_kabupaten)
        ctx.addIssue({
          path: ["kode_kabupaten"],
          code: "custom",
          message: "Kabupaten wajib diisi",
        });
      if (!data.kode_kecamatan)
        ctx.addIssue({
          path: ["kode_kecamatan"],
          code: "custom",
          message: "Kecamatan wajib diisi",
        });
    }

    if (
      data.laka_lantas === "1" ||
      data.laka_lantas === "2" ||
      data.laka_lantas === "3"
    ) {
      if (!data.tgl_kejadian) {
        ctx.addIssue({
          path: ["tgl_kejadian"],
          code: "custom",
          message: (
            <span style={{ fontSize: 8 }}>Tanggal kejadian wajib diisi</span>
          ),
        });
      }
    }
  });

const useProfileData = (
  profile,
  sepBySep,
  sepRencanaKontrol,
  doctorId,
  dokterList,
  parentComponent
) => {
  return useMemo(() => {
    if (!profile || Object.keys(profile).length === 0)
      return { profileData: {}, sepData: {} };

    const hasSepData = sepBySep?.data && Object.keys(sepBySep.data).length > 0;
    const hasSepRencanaKontrolData =
      sepRencanaKontrol?.data && Object.keys(sepRencanaKontrol.data).length > 0;

    let selectedDoctor = null;
    let selectedPoli = "";
    let selectedDiagnosa = null;

    if (hasSepData && sepBySep.data.dpjp?.kdDPJP) {
      const dokterBySep = dokterList?.filter(
        (item) => item.kode_bridge === sepBySep?.data?.dpjp?.kdDPJP
      );

      if (dokterBySep && dokterBySep.length > 0) {
        const poliFromSep = sepBySep.data.poli || "";

        const normalizeString = (str) => str.replace(/\s+/g, "").toLowerCase();

        const matchDokterBySep = dokterBySep?.find((item) =>
          normalizeString(poliFromSep).includes(
            normalizeString(item.spesialis_name || "")
          )
        );

        if (matchDokterBySep) {
          selectedDoctor = matchDokterBySep;
          selectedPoli = matchDokterBySep.spesialis_name;
        }
      }

      if (hasSepRencanaKontrolData) {
        selectedDiagnosa = sepRencanaKontrol.data.diagnosa;
      }
    }

    if (!selectedDoctor) {
      selectedDoctor = dokterList?.find((item) => item.id === doctorId);
      selectedPoli = selectedDoctor.spesialis_name;
    }

    if (!selectedDiagnosa) {
      selectedDiagnosa = `${profile.items?.rujukan?.diagnosa?.kode} - ${profile.items?.rujukan?.diagnosa?.nama}`;
    }

    return {
      profileData: {
        nik: profile?.items?.rujukan?.peserta?.nik || "",
        hak_kelas:
          profile?.items?.rujukan?.peserta?.hakKelas?.kode === "3"
            ? "Kelas 3"
            : profile?.hakKelas?.kode === "2"
            ? "Kelas 2"
            : "Kelas 1",
        asal_rujukan: profile?.items?.rujukan?.provPerujuk?.nama || "",
        tgl_rawat: profile?.items?.rujukan?.tglKunjungan || "",
        pekerjaan:
          profile?.items?.rujukan?.peserta?.jenisPeserta?.keterangan || "",
      },
      sepData: {
        tgl_rujukan: profile?.items?.rujukan?.tglKunjungan || "",
        ppk_rujukan: profile?.items?.rujukan?.provPerujuk?.nama || "",
        nomor_surat:
          sepBySep?.data && Object.keys(sepBySep?.data).length > 0
            ? sepBySep?.data.noRujukan
            : profile?.items?.rujukan?.noKunjungan || "",
        doctor_id: selectedDoctor?.id || "",
        poliklinik: selectedPoli,
        diagnosa_input:
          parentComponent === "rajal"
            ? selectedDiagnosa.split(" - ")[0].trim()
            : "",
      },
    };
  }, [profile, sepBySep, doctorId, dokterList, parentComponent]);
};

const ProfileForm = memo(({ formProfile, isLoadingProfile }) => {
  return (
    <div className="flex flex-col w-full bg-stone-50 py-2">
      <form>
        <div className="flex flex-col w-full pb-2 px-4 space-y-1">
          <label htmlFor="nik" className="label-style">
            nik
          </label>
          <div className="relative">
            <Input
              {...formProfile.register("nik")}
              placeholder="NIK"
              disabled
              className="rounded-sm text-stone-500"
            />
            {isLoadingProfile && <SkeletonFieldValue />}
          </div>
        </div>
        <div className="flex flex-col w-full pb-2 px-4 space-y-1">
          <label htmlFor="hak_kelas" className="label-style">
            hak kelas
          </label>
          <div className="relative">
            <Input
              {...formProfile.register("hak_kelas")}
              placeholder="Hak Kelas"
              disabled
              className="rounded-sm text-stone-500"
            />
            {isLoadingProfile && <SkeletonFieldValue />}
          </div>
        </div>
        <div className="flex flex-col w-full pb-2 px-4 space-y-1">
          <label htmlFor="asal_rujukan" className="label-style">
            asal rujukan
          </label>
          <div className="relative">
            <Input
              {...formProfile.register("asal_rujukan")}
              placeholder="Asal Rujukan"
              disabled
              className="rounded-sm text-stone-500"
            />
            {isLoadingProfile && <SkeletonFieldValue />}
          </div>
        </div>
        <div className="flex flex-col w-full pb-2 px-4 space-y-1">
          <label htmlFor="tgl_rawat" className="label-style">
            tanggal rawat
          </label>
          <div className="relative">
            <Input
              {...formProfile.register("tgl_rawat")}
              placeholder="Tanggal Rawat"
              disabled
              className="rounded-sm text-stone-500"
            />
            {isLoadingProfile && <SkeletonFieldValue />}
          </div>
        </div>
        <div className="flex flex-col w-full pb-2 px-4 space-y-1">
          <label htmlFor="pekerjaan" className="label-style">
            pekerjaan
          </label>
          <div className="relative">
            <Input
              {...formProfile.register("pekerjaan")}
              placeholder="Pekerjaan"
              disabled
              className="rounded-sm text-stone-500"
            />
            {isLoadingProfile && <SkeletonFieldValue />}
          </div>
        </div>
      </form>
    </div>
  );
});

const HistoryList = memo(({ historySep, isLoadingHistory }) => {
  if (isLoadingHistory) return <SkeletonCard />;

  return (
    <div className="flex w-full max-h-[40vh] overflow-y-auto">
      <div className="flex flex-col w-full justify-start px-2">
        {historySep?.items?.map((item, index) => (
          <div
            key={index}
            className="flex flex-col w-full bg-white mb-2 rounded-sm p-3"
          >
            <div className="font-semibold text-md">{item.noSep}</div>
            <div className="font-semibold text-sm">
              {item.jnsPelayanan === "RJALAN" ? "Rawat Jalan" : "Rawat Inap"}
            </div>
            <div className="flex space-x-4" style={{ fontSize: 10 }}>
              <div className="w-1/4">Tgl SEP</div>
              <div className="w-3/4">
                : {format(new Date(item.tglSep), "dd/MM/yyyy")}
              </div>
            </div>
            <div className="flex space-x-4" style={{ fontSize: 10 }}>
              <div className="w-1/4">Tgl Pulang</div>
              <div className="w-3/4">
                : {format(new Date(item.tglPlgSep), "dd/MM/yyyy")}
              </div>
            </div>
            <div className="flex space-x-4" style={{ fontSize: 10 }}>
              <div className="w-1/4">PPK</div>
              <div className="w-3/4">: {item.ppkPelayanan}</div>
            </div>
            <div className="flex space-x-4" style={{ fontSize: 10 }}>
              <div className="w-1/4">Diagnosa</div>
              <div className="w-3/4">: {item.diagnosa}</div>
            </div>
            <div className="flex space-x-4" style={{ fontSize: 10 }}>
              <div className="w-1/4">Poliklinik</div>
              <div className="w-3/4">: {item.poli}</div>
            </div>
            <div className="flex space-x-4" style={{ fontSize: 10 }}>
              <div className="w-1/4">Kelas</div>
              <div className="w-3/4">: {item.kelasRawat}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const LakaLantasFields = memo(
  ({
    lakaLantasValue,
    suplesiValue,
    setShowPencarianSepSuplesi,
    setShowRujukanKhusus,
    formCreateSep,
    provinsi,
    kabupaten,
    kecamatan,
    isLoadingKabupaten,
    isLoadingKecamatan,
  }) => {
    const isKLLorBKK = lakaLantasValue === "1" || lakaLantasValue === "2";
    const isKK = lakaLantasValue === "3";

    if (!isKLLorBKK && !isKK) return null;

    return (
      <div className="space-y-1">
        <div>
          <label htmlFor="keterangan" className="label-style">
            keterangan
          </label>
          <Input
            {...formCreateSep.register("keterangan")}
            placeholder="Keterangan"
            className="rounded-sm"
          />
        </div>

        <div className={isKLLorBKK ? "flex w-full gap-4" : ""}>
          <div className="flex flex-col w-1/3">
            <label htmlFor="tgl_kejadian" className="label-style">
              tanggal kejadian
            </label>
            <DatePicker
              control={formCreateSep.control}
              name="tgl_kejadian"
              placeholder="dd/mm/yyyy"
              triggerByIcon={true}
            />
            {formCreateSep.formState.errors.tgl_kejadian && (
              <p
                className="pt-1 px-1 text-left text-red-500"
                style={{ fontSize: 8 }}
              ></p> // Error message dikosongkan agar tidak muncul double
            )}
          </div>
          {isKLLorBKK && (
            <div
              className={`flex flex-col ${
                suplesiValue === "1" ? "w-1/3" : "w-2/3"
              }`}
            >
              <label htmlFor="suplesi" className="label-style">
                suplesi
              </label>
              <Controller
                name="suplesi"
                control={formCreateSep.control}
                render={({ field }) => {
                  const selected = SUPLESI.find(
                    (item) => item.value === field.value
                  );
                  return (
                    <div className="relative flex items-center">
                      <Select
                        value={field.value ?? ""}
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
                          <SelectValue placeholder="Pilih Suplesi">
                            {selected?.key ?? "Pilih Suplesi"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {SUPLESI.map((item) => {
                              return (
                                <SelectItem key={item.key} value={item.value}>
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
              {formCreateSep.formState.errors.suplesi && (
                <p
                  className="pt-1 px-1 text-left text-red-500"
                  style={{ fontSize: 8 }}
                >
                  {formCreateSep.formState.errors.suplesi.message}
                </p>
              )}
            </div>
          )}
          {suplesiValue === "1" && (
            <>
              <div className="flex flex-col w-1/3">
                <label htmlFor="nomor_sep_suplesi" className="label-style">
                  nomor sep suplesi
                </label>
                <div className="relative">
                  <Input
                    {...formCreateSep.register("nomor_sep_suplesi")}
                    placeholder="Nomor SEP Suplesi"
                    className="rounded-md"
                  />
                  <Button
                    type="button"
                    variant="white"
                    size="xs"
                    className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer bg-primary1 rounded-sm cursor-pointer hover:opacity-80"
                    onClick={() => {
                      setShowPencarianSepSuplesi((prev) => !prev);
                      setShowRujukanKhusus(false);
                    }}
                  >
                    <Icon icon="token:get" className="text-white" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {isKLLorBKK && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="kode_propinsi" className="label-style">
                provinsi laka lantas
              </label>
              <Controller
                name="kode_propinsi"
                control={formCreateSep.control}
                render={({ field }) => {
                  const selected = provinsi?.items?.list?.find(
                    (item) => item.kode === field.value
                  );

                  return (
                    <div className="relative flex items-center">
                      <Select
                        value={field.value ?? ""}
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
                          <SelectValue placeholder="Pilih Provinsi Laka Lantas">
                            {selected?.nama ?? "Pilih Provinsi Laka Lantas"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {provinsi?.items?.list?.map((item) => {
                              return (
                                <SelectItem key={item.kode} value={item.kode}>
                                  {item.nama}
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
              {formCreateSep.formState.errors.kode_propinsi && (
                <p
                  className="pt-1 px-1 text-left text-red-500"
                  style={{ fontSize: 8 }}
                >
                  {formCreateSep.formState.errors.kode_propinsi.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="kode_kabupaten" className="label-style">
                kabupaten laka lantas
              </label>
              <Controller
                name="kode_kabupaten"
                control={formCreateSep.control}
                render={({ field }) => {
                  const selected = kabupaten?.data?.list?.find(
                    (item) => item.kode === field.value
                  );

                  return (
                    <div className="relative flex items-center">
                      <Select
                        value={field.value ?? ""}
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
                          <SelectValue placeholder="Pilih Provinsi Laka Lantas">
                            {selected?.nama ?? "Pilih Provinsi Laka Lantas"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {isLoadingKabupaten ? (
                              <SelectItem disabled value="loading">
                                Memuat data ...
                              </SelectItem>
                            ) : kabupaten?.data?.list?.length > 0 ? (
                              kabupaten?.data?.list?.map((item) => (
                                <SelectItem key={item.kode} value={item.kode}>
                                  {item.nama}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled value="empty">
                                Pilih provinsi terlebih dahulu
                              </SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }}
              />
              {formCreateSep.formState.errors.kode_kabupaten && (
                <p
                  className="pt-1 px-1 text-left text-red-500"
                  style={{ fontSize: 8 }}
                >
                  {formCreateSep.formState.errors.kode_kabupaten.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="kode_kecamatan" className="label-style">
                kecamatan laka lantas
              </label>
              <Controller
                name="kode_kecamatan"
                control={formCreateSep.control}
                render={({ field }) => {
                  const selected = kecamatan?.data?.list?.find(
                    (item) => item.kode === field.value
                  );

                  return (
                    <div className="relative flex items-center">
                      <Select
                        value={field.value ?? ""}
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
                          <SelectValue placeholder="Pilih Provinsi Laka Lantas">
                            {selected?.nama ?? "Pilih Provinsi Laka Lantas"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {isLoadingKecamatan ? (
                              <SelectItem disabled value="loading">
                                Memuat data ...
                              </SelectItem>
                            ) : kecamatan?.data?.list?.length > 0 ? (
                              kecamatan?.data?.list?.map((item) => (
                                <SelectItem key={item.kode} value={item.kode}>
                                  {item.nama}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem disabled value="empty">
                                Pilih kabupaten terlebih dahulu
                              </SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }}
              />
              {formCreateSep.formState.errors.kode_kecamatan && (
                <p
                  className="pt-1 px-1 text-left text-red-500"
                  style={{ fontSize: 8 }}
                >
                  {formCreateSep.formState.errors.kode_kecamatan.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

const DialogProfilAndCreateSep = ({
  prb,
  ppkPerujuk,
  noSep,
  parentComponent,
}) => {
  const [selectedTab, setSelectedTab] = useState("history");
  const [showRujukanKhusus, setShowRujukanKhusus] = useState(false);
  const [showPencarianSepSuplesi, setShowPencarianSepSuplesi] = useState(false);
  const { regId, nama, doctorId, noAsuransi } = useReg();
  const { downloadPdf } = useDownloadPdf();

  // Memoized filters
  const [filtersHistorySep, setFiltersHistorySep] = useState(() => ({
    no_kartu: noAsuransi,
    from: format(subMonths(new Date(), 3), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
  }));

  // Data Fetching
  const { data: profile, isLoading: isLoadingProfile } = useFetchQuery({
    queryKey: "profile",
    apiFn: getSepDetail,
    filters: { no_kartu: noAsuransi },
    withPagination: false,
  });

  const { data: sepRencanaKontrol } = useFetchParams({
    queryKey: "sep rencana kontrol",
    apiFn: getSepRencanaKontrol,
    params: noSep,
    auto: !!noSep,
  });

  const { data: sepBySep } = useFetchParams({
    queryKey: "sep by sep",
    apiFn: getSepBySep,
    params: noSep,
    auto: !!noSep,
  });

  const { data: provinsi } = useFetchQuery({
    queryKey: "provinsi",
    apiFn: getListProvinsi,
    withPagination: false,
  });

  const { data: dokterList } = useFetchDoctor();
  const { data: poliklinik } = useFetchPoliklinik();

  // Form instances
  const formHistory = useForm({
    defaultValues: {
      no_kartu: noAsuransi,
      from: format(subMonths(new Date(), 3), "yyyy-MM-dd"),
      to: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const formProfile = useForm();

  const formSearchRujukanKhusus = useForm({
    defaultValues: {
      tanggal: "",
    },
  });

  const formSearchSepSuplesi = useForm({
    defaultValues: {
      no_kartu_peserta: noAsuransi,
      tgl_pelayanan: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const formCreateSep = useForm({
    resolver: zodResolver(createSepSchema),
    defaultValues: {
      asal_rujukan:
        parentComponent === "igd" ? ppkPerujuk || "Ngemplak II" : "1",
      tgl_sep: format(new Date(), "yyyy-MM-dd"),
      cob: "0",
      katarak: "0",
      tgl_rujukan: "",
      ppk_rujukan: "",
      jenis_pelayanan: "",
      kode_dpjp: "",
      dpjp_layanan: "",
      diagnosa_input: "",
      diagnosa_full: "",
      diagnosa_awal: "",
      nomor_surat: "",
      nomor_kartu: "",
      laka_lantas: "0",
      keterangan: "",
      tgl_kejadian: format(new Date(), "yyyy-MM-dd"),
      suplesi: "",
      nomor_sep_suplesi: "",
      kode_propinsi: "",
      kode_kabupaten: "",
      kode_kecamatan: "",
      tujuan_kunjungan: 2,
      flag_procedure: "",
      kode_penunjang: "",
      assesment_pel: "",
      eksekutif: "0",
      catatan: "",
    },
  });

  // Untuk mencari diagnosa pada form create SEP IGD
  const diagnosaInput = formCreateSep.watch("diagnosa_input");

  const debouncedDiagnosa = useDebounce({ value: diagnosaInput, delay: 500 });

  const { data: diagnosaList, isLoading: isLoadingDiagnosa } = useFetchParams({
    queryKey: "diagnosa input",
    apiFn: getListDiagnosa,
    params: debouncedDiagnosa ? debouncedDiagnosa : "",
  });

  useEffect(() => {
    if (diagnosaInput && diagnosaList?.data?.diagnosa?.length > 0) {
      const selected = diagnosaList.data.diagnosa.find(
        (d) => d.kode === diagnosaInput
      );

      if (selected) {
        formCreateSep.setValue("diagnosa_full", selected.nama, {
          shouldDirty: false,
          shouldValidate: true,
        });
      } else {
        formCreateSep.setValue("diagnosa_full", "", {
          shouldDirty: false,
          shouldValidate: true,
        });
      }
    } else if (
      diagnosaInput &&
      (!diagnosaList || diagnosaList?.data?.diagnosa?.length === 0)
    ) {
      formCreateSep.setValue("diagnosa_full", "", {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [diagnosaInput, diagnosaList, formCreateSep]);

  // Watch values
  const suplesiValue = useWatch({
    control: formCreateSep.control,
    name: "suplesi",
  });

  const lakaLantasValue = useWatch({
    control: formCreateSep.control,
    name: "laka_lantas",
  });

  const kodeProvinsi = useWatch({
    control: formCreateSep.control,
    name: "kode_propinsi",
  });

  const kodeKabupaten = useWatch({
    control: formCreateSep.control,
    name: "kode_kabupaten",
  });

  // Custom hook untuk profile data
  const { profileData, sepData } = useProfileData(
    profile,
    sepBySep,
    sepRencanaKontrol,
    doctorId,
    dokterList,
    parentComponent
  );

  // Dependent data fetching
  const { data: kabupaten, isLoading: isLoadingKabupaten } = useFetchParams({
    queryKey: "kabupaten",
    apiFn: getListKabupaten,
    params: kodeProvinsi,
    auto: !!kodeProvinsi,
  });

  const { data: kecamatan, isLoading: isLoadingKecamatan } = useFetchParams({
    queryKey: "kecamatan",
    apiFn: getListKecamatan,
    params: kodeKabupaten,
    auto: !!kodeKabupaten,
  });

  const { data: historySep, isLoading: isLoadingHistory } = useFetchQuery({
    queryKey: "history sep",
    apiFn: getSepHistory,
    filters: filtersHistorySep,
    withPagination: false,
  });

  // Memoized callbacks
  const onSubmitHistory = useCallback((formData) => {
    setFiltersHistorySep(formData);
  }, []);

  const { mutate } = useCreate({
    apiFn: createSep,
    successMessage: "Berhasil menerbitkan SEP.",
    errorMessage: "Gagal menerbitkan SEP.",
  });

  const onSubmitSep = useCallback(
    (formData) => {
      if (!formData || Object.keys(formData).length === 0) return;

      const kodeDpjp =
        dokterList?.find((item) => item.id === formData.doctor_id)
          ?.kode_bridge ?? "";
      const kodeDiagnosa = formData.diagnosa_full.split(" ")[0];
      const { doctor_id, diagnosa_full, ...rest } = formData;

      let basePayload = {};

      if (parentComponent === "rajal") {
        basePayload = {
          ...rest,
          id_registration: regId,
          jenis_pelayanan: "2",
          kode_dpjp: kodeDpjp,
          dpjp_layanan: kodeDpjp,
          diagnosa_awal: kodeDiagnosa,
          nomor_kartu: noAsuransi,
          tujuan_kunjungan: "2",
        };
      }

      if (parentComponent === "igd") {
        basePayload = {
          ...rest,
          id_registration: regId,
          asal_rujukan: "2",
          jenis_pelayanan: "2",
          kode_dpjp: kodeDpjp,
          dpjp_layanan: kodeDpjp,
          tujuan: "IGD",
          tujuan_kunjungan: "2",
          nomor_surat: "",
        };
      }

      const payload =
        rest.laka_lantas === "1" ||
        rest.laka_lantas === "2" ||
        rest.laka_lantas === "3"
          ? {
              ...basePayload,
              tanggal_kejadian:
                format(new Date(rest.tgl_kejadian), "yyyy-MM-dd") ?? "",
            }
          : basePayload;

      mutate(payload);
    },
    [dokterList, regId, noAsuransi, mutate]
  );

  // Effect untuk update form data
  useEffect(() => {
    if (Object.keys(profileData).length > 0) {
      formProfile.reset(profileData);
    }
  }, [profileData, formProfile]);

  useEffect(() => {
    if (Object.keys(sepData).length > 0) {
      formCreateSep.reset((prev) => ({ ...prev, ...sepData }));
    }
  }, [sepData, formCreateSep]);

  // Render sections
  const profileAndHistorySep = useMemo(() => {
    let content = null;

    if (showRujukanKhusus) {
      content = (
        <div className="flex flex-col w-full items-center p-2 space-y-2 rounded-md bg-stone-50">
          <div className="flex w-full min-h-[20vh] bg-white shadow-md pb-1">
            <div className="flex flex-col w-full space-y-2 px-2">
              <div className="flex w-full h-[5vh] items-center">
                <span className="font-semibold text-sm uppercase">
                  filter rujukan khusus
                </span>
              </div>
              <div className="space-y-1">
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
                    onClick={() =>
                      formSearchRujukanKhusus.setValue("date", new Date())
                    }
                    style={{ fontSize: 9 }}
                  >
                    Today
                  </Button>
                </div>
                <DatePicker
                  name="date"
                  control={formSearchRujukanKhusus.control}
                  placeholder="mm / yyyy"
                  showTime={false}
                  withoutDate={true}
                  triggerByIcon={false}
                />
                <div className="flex py-1 justify-end">
                  <Button
                    type="submit"
                    variant="primary1"
                    size="sm"
                    className="capitalize"
                  >
                    <Icon icon="mingcute:search-line" /> cari
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full items-center space-y-2 rounded-md bg-stone-50">
            <div className="flex flex-col w-full min-h-[20vh] bg-white shadow-md py-2">
              <div className="flex flex-col w-full space-y-2 px-2">
                <div className="flex w-full h-[10vh] items-center px-2 justify-between">
                  <span className="font-semibold text-sm uppercase">
                    daftar rujukan khusus
                  </span>
                  <div className="flex">
                    <SearchField />
                  </div>
                </div>
              </div>
              <div className="w-full px-2">
                <Table
                  border="border"
                  header={[
                    "id_rujukan",
                    "diagppk",
                    "nmpst",
                    "no_kapst",
                    "no_rujukan",
                    "tgl_rujukan_awal",
                    "tgl_rujukan_berakhir",
                  ]}
                  customWidths={{
                    id_rujukan: "min-w-[10rem]",
                    diagppk: "min-w-[9rem]",
                    nmpst: "min-w-[8rem]",
                    no_kapst: "min-w-[9rem]",
                    no_rujukan: "min-w-[10rem]",
                    tgl_rujukan_awal: "min-w-[13rem]",
                    tgl_rujukan_berakhir: "min-w-[15rem]",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else if (showPencarianSepSuplesi) {
      content = (
        <div className="flex flex-col w-full items-center p-2 space-y-2 rounded-md bg-stone-50">
          <div className="flex w-full min-h-[20vh] bg-white shadow-md pb-1">
            <div className="flex flex-col w-full space-y-2 px-2">
              <div className="flex w-full h-[5vh] items-center">
                <span className="font-semibold text-sm uppercase">
                  pencarian sep suplesi
                </span>
              </div>
              <div className="flex w-full gap-2">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="date"
                    className="label-style"
                    style={{ fontSize: 9 }}
                  >
                    no bpjs
                  </label>
                  <Input
                    {...formSearchSepSuplesi.register("no_kartu_peserta")}
                    placeholder="No BPJS"
                    disabled
                    className="rounded-sm text-stone-500"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="tgl_pelayanan"
                    className="label-style"
                    style={{ fontSize: 9 }}
                  >
                    tanggal pelayanan
                  </label>
                  <DatePicker
                    name="tgl_pelayanan"
                    control={formSearchSepSuplesi.control}
                    placeholder="dd/ mm / yyyy"
                    showTime={false}
                    triggerByIcon={true}
                  />
                </div>
              </div>
              <div className="flex py-1 justify-end">
                <Button
                  type="submit"
                  variant="primary1"
                  size="sm"
                  className="capitalize"
                >
                  <Icon icon="mingcute:search-line" /> cari
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full items-center space-y-2 rounded-md bg-stone-50">
            <div className="flex flex-col w-full min-h-[20vh] bg-white shadow-md py-2">
              <div className="flex flex-col w-full space-y-2 px-2">
                <div className="flex w-full h-[10vh] items-center px-2">
                  <SearchField />
                </div>
              </div>
              <div className="w-full px-2">
                <Table
                  border="border"
                  header={[
                    "no_registrasi",
                    "no_sep",
                    "no_sep_awal",
                    "no_surat_jaminan",
                    "tanggal_kejadian",
                    "tanggal_sep",
                  ]}
                  customWidths={{
                    no_registrasi: "min-w-[11rem]",
                    no_sep: "min-w-[8rem]",
                    no_sep_awal: "min-w-[10rem]",
                    no_surat_jaminan: "min-w-[13rem]",
                    tanggal_kejadian: "min-w-[13rem]",
                    tanggal_sep: "min-w-[11rem]",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else if (selectedTab === "history") {
      content = (
        <div className="flex flex-col w-full items-center justify-center bg-stone-50 rounded-md space-y-1 py-2">
          <div className="flex w-full">
            <form onSubmit={formHistory.handleSubmit(onSubmitHistory)}>
              <div className="flex space-x-4 px-2">
                <div className="flex flex-col">
                  <label htmlFor="no_kartu" className="label-style">
                    no bpjs
                  </label>
                  <Input
                    {...formHistory.register("no_kartu")}
                    placeholder="No BPJS"
                    className="rounded-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="tanggal_awal" className="label-style">
                    tanggal mulai
                  </label>
                  <DatePicker
                    control={formHistory.control}
                    name="from"
                    placeholder="dd/mm/yyyy"
                    triggerByIcon={true}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="tanggal_akhir" className="label-style">
                    tanggal selesai
                  </label>
                  <DatePicker
                    control={formHistory.control}
                    name="to"
                    placeholder="dd/mm/yyyy"
                    triggerByIcon={true}
                  />
                </div>
              </div>

              <div className="flex w-full min-h-[6vh] justify-end pr-2 py-2">
                <Button
                  type="submit"
                  variant="outlined"
                  className="capitalize text-stone-500"
                >
                  <Icon icon="mingcute:search-line" /> cari
                </Button>
              </div>
            </form>
          </div>
          <div className="flex flex-col w-full items-center justify-center bg-stone-50 rounded-md space-y-1 py-2">
            <HistoryList
              historySep={historySep}
              isLoadingHistory={isLoadingHistory}
            />
          </div>
        </div>
      );
    } else if (selectedTab === "profile") {
      content = (
        <ProfileForm
          formProfile={formProfile}
          isLoadingProfile={isLoadingProfile}
        />
      );
    }

    return (
      <div className="flex flex-col w-full justify-center px-4 py-2">
        <div className="flex flex-col w-full items-center pb-2">
          <div className="font-semibold text-xl">{nama}</div>
          <div className="font-semibold text-xl mb-2">
            No Kartu: {noAsuransi}
          </div>
        </div>

        {!showRujukanKhusus && !showPencarianSepSuplesi && (
          <div className="flex w-1/2">
            <Button
              variant={
                selectedTab === "profile" ? "primaryGradient" : "outlinedGreen1"
              }
              className="flex w-full rounded-tl-md rounded-bl-md uppercase"
              onClick={() => setSelectedTab("profile")}
            >
              profile
            </Button>
            <Button
              variant={
                selectedTab === "history" ? "primaryGradient" : "outlinedGreen1"
              }
              className="flex w-full rounded-tr-md rounded-br-md uppercase"
              onClick={() => setSelectedTab("history")}
            >
              history
            </Button>
          </div>
        )}

        {content}
      </div>
    );
  }, [
    selectedTab,
    showRujukanKhusus,
    showPencarianSepSuplesi,
    nama,
    noAsuransi,
    historySep,
    isLoadingHistory,
    formProfile,
    isLoadingProfile,
  ]);

  const createSepForm = (
    <div className="flex flex-col w-full justify-center px-4 py-2">
      <div className="flex flex-col w-full items-center pb-1">
        {prb && prb !== "" ? (
          <div className="flex w-full bg-pink uppercase text-sm rounded-sm px-4 py-2 border border-stone-300">
            {prb}
          </div>
        ) : null}
        <div className="flex w-full items-center justify-between py-1">
          <span className=" font-semibold">
            No. SEP : {noSep ? noSep : "-"}
          </span>
          <div>
            <Button
              variant="primary1"
              className="capitalize"
              style={{ fontSize: 10 }}
              onClick={() => {
                setShowRujukanKhusus((prev) => !prev);
                setShowPencarianSepSuplesi(false);
              }}
            >
              list rujukan khusus
            </Button>
          </div>
        </div>
      </div>
      <div className="flex w-full">
        <form onSubmit={formCreateSep.handleSubmit(onSubmitSep)}>
          <div className="w-full bg-stone-50 rounded-md px-4 pt-2 pb-4 mb-8">
            <div className="grid grid-cols-3 gap-6">
              {parentComponent === "rajal" && (
                <div>
                  <label htmlFor="" className="label-style">
                    ppk asal rujukan
                  </label>
                  <Controller
                    name="asal_rujukan"
                    control={formCreateSep.control}
                    render={({ field }) => {
                      const selected = ASAL_RUJUKAN.find(
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
                              <SelectValue placeholder="Pilih PPK Asal Rujukan">
                                {selected?.key ?? "Pilih PPK Asal Rujukan"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {ASAL_RUJUKAN.map((item) => {
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
              )}
              {parentComponent === "igd" && (
                <div>
                  <label htmlFor="" className="label-style">
                    ppk asal rujukan
                  </label>
                  <Input
                    {...formCreateSep.register("asal_rujukan")}
                    placeholder="PPK Asal Rujukan"
                    disabled={true}
                    className="rounded-md"
                  />
                </div>
              )}
              <div>
                <label htmlFor="" className="label-style">
                  tgl sep
                </label>
                <DatePicker
                  control={formCreateSep.control}
                  name="tgl_sep"
                  triggerByIcon={false}
                  disabledAll={true}
                />
                {formCreateSep.formState.errors.tgl_sep && (
                  <p
                    className="pt-1 px-1 text-left text-red-500"
                    style={{ fontSize: 8 }}
                  >
                    {formCreateSep.formState.errors.tgl_sep.message}
                  </p>
                )}
              </div>
              <div className="flex items-end">
                <div className="flex h-2/3 items-center space-x-4">
                  <Controller
                    name="cob"
                    control={formCreateSep.control}
                    render={({ field }) => (
                      <div className="flex space-x-2">
                        <Checkbox
                          id="cob"
                          checked={field.value === "1"}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? "1" : "0")
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="cob"
                            className="flex items-center text-xs font-medium uppercase leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            cob
                          </label>
                        </div>
                      </div>
                    )}
                  />
                  <Controller
                    name="katarak"
                    control={formCreateSep.control}
                    render={({ field }) => (
                      <div className="flex space-x-2">
                        <Checkbox
                          id="cob"
                          checked={field.value === "1"}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? "1" : "0")
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="katarak"
                            className="flex items-center text-xs font-medium uppercase leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            katarak
                          </label>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            {parentComponent === "rajal" && (
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label htmlFor="" className="label-style">
                    tgl rujukan
                  </label>
                  <DatePicker
                    control={formCreateSep.control}
                    name="tgl_rujukan"
                    placeholder={isLoadingHistory ? "" : "dd/mm/yyyy"}
                    triggerByIcon={true}
                    disabledAll={isLoadingHistory}
                    isLoading={isLoadingHistory}
                  />
                </div>
                <div>
                  <label htmlFor="ppk_rujukan" className="label-style">
                    ppk rujukan
                  </label>
                  <div className="relative">
                    <Input
                      {...formCreateSep.register("ppk_rujukan")}
                      className="rounded-sm"
                    />
                    {isLoadingHistory && <SkeletonFieldValue />}
                  </div>
                </div>
                <div>
                  <label htmlFor="nomor_surat" className="label-style">
                    no rujukan
                  </label>
                  <div className="relative">
                    <Input
                      {...formCreateSep.register("nomor_surat")}
                      className="rounded-sm"
                    />
                    {isLoadingHistory && <SkeletonFieldValue />}
                  </div>
                  {formCreateSep.formState.errors.nomor_surat && (
                    <p
                      className="pt-1 px-1 text-left text-red-500"
                      style={{ fontSize: 8 }}
                    >
                      {formCreateSep.formState.errors.nomor_surat.message}
                    </p>
                  )}
                </div>
              </div>
            )}
            {parentComponent === "rajal" && (
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label htmlFor="doctor_id" className="label-style">
                    dpjp
                  </label>
                  <Controller
                    name="doctor_id"
                    control={formCreateSep.control}
                    render={({ field }) => {
                      const [open, setOpen] = useState(false);
                      const selected = dokterList?.find(
                        (item) => item.id === field.value
                      );

                      return (
                        <div className="relative">
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full max-h-[5vh] rounded-md border border-stone-400 justify-between"
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
                            <PopoverContent
                              side="bottom"
                              align="start"
                              avoidCollisions={false}
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
                                <CommandInput placeholder="Ketik nama dokter..." />
                                <CommandList className="max-h-[24vh]">
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
                                          const dokter = dokterList.find(
                                            (e) => e.id === item.id
                                          );
                                          const poli = poliklinik.find(
                                            (e) =>
                                              e.id === dokter?.poliklinik_id
                                          );
                                          formCreateSep.setValue(
                                            "poliklinik",
                                            poli?.name ||
                                              dokter?.spesialis_name ||
                                              ""
                                          );
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
                          {isLoadingHistory && <SkeletonControllerFieldValue />}
                        </div>
                      );
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="poliklinik" className="label-style">
                    poliklinik
                  </label>
                  <div className="relative">
                    <Input
                      {...formCreateSep.register("poliklinik")}
                      className="rounded-sm"
                      disabled
                    />
                    {isLoadingHistory && <SkeletonFieldValue />}
                  </div>
                </div>
                {!noSep && (
                  <div>
                    <label htmlFor="tujuan_kunjungan" className="label-style">
                      tujuan kunjungan
                    </label>
                    <Controller
                      name="tujuan_kunjungan"
                      control={formCreateSep.control}
                      render={({ field }) => {
                        const selected = TUJUAN_KUNJUNGAN.find(
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
                                className="w-full"
                                style={{ fontSize: 12 }}
                                icon={
                                  <Icon
                                    icon="dashicons:arrow-down"
                                    className="size-5 text-stone-900 hover:text-stone-400"
                                  />
                                }
                              >
                                <SelectValue placeholder="Pilih Tujuan Kunjungan">
                                  {selected?.key ?? "Pilih Tujuan Kunjungan"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {TUJUAN_KUNJUNGAN.map((item) => {
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
                )}
              </div>
            )}
            {parentComponent === "igd" && (
              <div className="grid grid-cols-[1fr_4fr] gap-6">
                <div>
                  <label htmlFor="diagnosa_input" className="label-style">
                    diagnosa
                  </label>
                  <Input
                    {...formCreateSep.register("diagnosa_input")}
                    className="rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="diagnosa_full" className="label-style">
                    diagnosa awal
                  </label>
                  <Controller
                    name="diagnosa_full"
                    control={formCreateSep.control}
                    render={({ field }) => {
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
                              <SelectValue>{field.value}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {diagnosaInput === "" ? (
                                  <SelectItem disabled value="empty">
                                    Lakukan pencarian diagnosa awal dengan input
                                    field diagnosa
                                  </SelectItem>
                                ) : isLoadingDiagnosa ? (
                                  <SelectItem disabled value="loading">
                                    Memuat data ...
                                  </SelectItem>
                                ) : Array.isArray(diagnosaList?.data) ? (
                                  diagnosaList?.data?.length === 0 ? (
                                    <SelectItem disabled value="empty">
                                      Data tidak ada
                                    </SelectItem>
                                  ) : null
                                ) : diagnosaList?.data?.diagnosa?.length > 0 ? (
                                  diagnosaList.data.diagnosa.map((item) => (
                                    <SelectItem
                                      key={item.kode}
                                      value={item.nama}
                                    >
                                      {item.nama}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem disabled value="empty">
                                    Data tidak ada
                                  </SelectItem>
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
            )}
            {parentComponent === "rajal" &&
              (!noSep ? (
                <div className="grid grid-cols-[1fr_4fr] gap-6">
                  <div>
                    <label htmlFor="diagnosa_input" className="label-style">
                      diagnosa
                    </label>
                    <Input
                      {...formCreateSep.register("diagnosa_input")}
                      className="rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="diagnosa_full" className="label-style">
                      diagnosa awal
                    </label>
                    <Controller
                      name="diagnosa_full"
                      control={formCreateSep.control}
                      render={({ field }) => {
                        return (
                          <div className="relative flex items-center">
                            <Select
                              value={field.value || ""}
                              onValueChange={(val) => {
                                field.onChange(val);
                              }}
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
                                <SelectValue>{field.value}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {diagnosaInput === "" ? (
                                    <SelectItem disabled value="empty">
                                      Lakukan pencarian diagnosa awal dengan
                                      input field diagnosa
                                    </SelectItem>
                                  ) : isLoadingDiagnosa ? (
                                    <SelectItem disabled value="loading">
                                      Memuat data ...
                                    </SelectItem>
                                  ) : Array.isArray(diagnosaList?.data) ? (
                                    diagnosaList?.data?.length === 0 ? (
                                      <SelectItem disabled value="empty">
                                        Data tidak ada
                                      </SelectItem>
                                    ) : null
                                  ) : diagnosaList?.data?.diagnosa?.length >
                                    0 ? (
                                    diagnosaList.data.diagnosa.map((item) => (
                                      <SelectItem
                                        key={item.kode}
                                        value={item.nama}
                                      >
                                        {item.nama}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem disabled value="empty">
                                      Data tidak ada
                                    </SelectItem>
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
              ) : (
                <div>
                  <label htmlFor="diagnosa_full" className="label-style">
                    diagnosa
                  </label>
                  <div className="relative">
                    <Input
                      {...formCreateSep.register("diagnosa_full")}
                      className="rounded-sm"
                      disabled
                    />
                    {isLoadingHistory && <SkeletonFieldValue />}
                  </div>
                </div>
              ))}
            <div>
              <label htmlFor="laka_lantas" className="label-style">
                laka lantas
              </label>
              <Controller
                name="laka_lantas"
                control={formCreateSep.control}
                render={({ field }) => {
                  const selected = LAKA_LANTAS.find(
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
                          <SelectValue placeholder="Pilih Laka Lantas">
                            {selected?.key ?? "Pilih Laka Lantas"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {LAKA_LANTAS.map((item) => {
                              return (
                                <SelectItem key={item.key} value={item.value}>
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

            <LakaLantasFields
              lakaLantasValue={lakaLantasValue}
              suplesiValue={suplesiValue}
              setShowPencarianSepSuplesi={setShowPencarianSepSuplesi}
              setShowRujukanKhusus={setShowRujukanKhusus}
              formCreateSep={formCreateSep}
              provinsi={provinsi}
              kabupaten={kabupaten}
              kecamatan={kecamatan}
              isLoadingKabupaten={isLoadingKabupaten}
              isLoadingKecamatan={isLoadingKecamatan}
            />

            <div>
              <label htmlFor="catatan" className="label-style">
                catatan
              </label>
              <Input
                {...formCreateSep.register("catatan")}
                placeholder="Catatan"
                className="rounded-sm"
              />
            </div>
          </div>

          <div className="flex w-full items-center">
            <div className="flex w-full justify-between">
              <Button
                type="button"
                variant="red1"
                size="sm"
                onClick={() => formCreateSep.reset(sepData)}
              >
                reset
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="primary1"
                  size="sm"
                  onClick={() => downloadPdf(cetakSep(noSep), {})}
                >
                  pdf
                </Button>
                <Button type="submit" variant="primary3" size="sm">
                  simpan
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex-1 w-full items-center p-4 bg-grey2">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex-1 w-full items-center justify-center bg-white rounded-md">
          {profileAndHistorySep}
        </div>
        <div className="flex-1 w-full items-center justify-center bg-white rounded-md">
          {createSepForm}
        </div>
      </div>
    </div>
  );
};

export default DialogProfilAndCreateSep;
