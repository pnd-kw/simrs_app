import { getDataBPJS, getDataNIK } from "@/api/ws_bridging/peserta";
import { optionsStatusPernikahan } from "@/utils/static_options/staticData";
import { format } from "date-fns";
import z from "zod";

export const defaultFormValuesProfileRekamMedis = {
  nik: "",
  no_kk: "",
  no_pasport: "",
  fullname: "",
  nama_ibu: "",
  first_visit: null,

  place_ob: "",
  date_ob: null,
  blood_type: null,
  gender: null,
  namaayah: "",
  statuspernikahan: "",
  ethnic: null,
  mobile_phone_number: "",
  phone_number: "",
  religion: null,
  education: null,
  occupation: null,
  nip: "",
  npwp: "",

  address_ktp: "",
  is_same_with_ktp: false,
  address_now: "",
  rt: "",
  rw: "",
  postal_code: "",
  country: "",
  province: "",
  city: "",
  district: "",
  sub_district: "",

  company_id: null,
  insurance_id: null,
  insurance_number: "",

  guarantor_connection: null,
  guarantor_name: "",

  sc_whatsapp: "",
  sc_email: "",
  sc_instagram: "",
  sc_facebook: "",

  status: true,
};

export const profileRekamMedisSchema = z
  .object({
    nik: z.string().min(15, "NIK minimal 15 digit"),
    no_kk: z.string().optional(),
    no_pasport: z.string().optional(),
    fullname: z
      .string()
      .min(1, { message: "Nama wajib diisi" })
      .max(100, { message: "Nama maksimal 100 karakter" }),
    nama_ibu: z.string().optional(),
    first_visit: z.date().optional().nullable(),

    place_ob: z.string().min(1, { message: "Tempat Lahir wajib diisi" }),
    date_ob: z
      .union([z.string(), z.date()])
      .transform((val) =>
        typeof val === "string" ? val : format(val, "yyyy-MM-dd")
      )
      .refine((val) => val !== "", { message: "Tanggal wajib diisi" }),
    blood_type: z.number({
      required_error: "Golongan Darah wajib diisi",
      invalid_type_error: "Golongan Darah wajib diisi",
    }),
    gender: z.number().optional(),
    namaayah: z.string().min(1, { message: "Nama Ayah wajib diisi" }),
    statuspernikahan: z.string({
      required_error: "Status Pernikahan wajib diisi",
      invalid_type_error: "Status Pernikahan wajib diisi",
    }),
    ethnic: z.number({
      required_error: "Suku wajib diisi",
      invalid_type_error: "Suku wajib diisi",
    }),
    mobile_phone_number: z.string().min(1, { message: "No HP wajib diisi" }),
    phone_number: z.string().min(1, { message: "No Telepon wajib diisi" }),
    religion: z.number({
      required_error: "Agama wajib diisi",
      invalid_type_error: "Agama wajib diisi",
    }),
    education: z.number().optional().nullable(),
    occupation: z.number({
      required_error: "Pekerjaan wajib diisi",
      invalid_type_error: "Pekerjaan wajib diisi",
    }),
    nip: z.string().optional(),
    npwp: z.string().optional(),

    address_ktp: z.string().min(1, { message: "Alamat KTP wajib diisi" }),
    is_same_with_ktp: z.boolean().default(false),
    address_now: z.string().min(1, { message: "Alamat Sekarang wajib diisi" }),
    rt: z.string().optional(),
    rw: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string({
      required_error: "Negara wajib diisi",
      invalid_type_error: "Negara wajib diisi",
    }),
    province: z.string({
      required_error: "Negara wajib diisi",
      invalid_type_error: "Negara wajib diisi",
    }),
    city: z.string({
      required_error: "Provinsi wajib diisi",
      invalid_type_error: "Provinsi wajib diisi",
    }),
    district: z.string({
      required_error: "Kecamatan wajib diisi",
      invalid_type_error: "Kecamatan wajib diisi",
    }),
    sub_district: z.string({
      required_error: "Kelurahan wajib diisi",
      invalid_type_error: "Kelurahan wajib diisi",
    }),

    company_id: z.number({
      required_error: "Perusahaan wajib diisi",
      invalid_type_error: "Perusahaan wajib diisi",
    }),
    insurance_id: z.number({
      required_error: "Asuransi wajib diisi",
      invalid_type_error: "Asuransi wajib diisi",
    }),
    insurance_number: z.string().optional(),

    guarantor_connection: z.number({
      required_error: "Penanggung wajib diisi",
      invalid_type_error: "Penanggung wajib diisi",
    }),
    guarantor_name: z
      .string()
      .min(1, { message: "Nama Penanggung wajib diisi" }),

    sc_whatsapp: z.string().optional(),
    sc_email: z.string().optional(),
    sc_instagram: z.string().optional(),
    sc_facebook: z.string().optional(),

    status: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.insurance_id !== 1 && !data.insurance_number) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No. Asuransi wajib diisi",
        path: ["insurance_number"],
      });
    }
  });

export const getProfileRekamMedisFields = (setValue) => [
  {
    type: "input",
    name: "nik",
    label: "NIK",
    placeholder: "Masukkan NIK",
    colSpan: "col-span-2",
    withFetchButton: true,
    setValue,
    showRequiredNote: true,
    fetchAction: {
      api: (nik) => getDataNIK(`nik=${nik}`),
      mapResult: (res) => {
        const peserta = res?.data?.peserta;
        return {
          fullname: peserta?.nama || "",
          gender: peserta?.sex === "L" ? 1 : peserta?.sex === "P" ? 2 : "",
          mobile_phone_number: peserta?.mr?.noTelepon || "",
          phone_number: peserta?.mr?.noTelepon || "",
          insurance_number: peserta?.noKartu || "",
          insurance_id: 2,
        };
      },
    },
    layout: "horizontal",
  },
  {
    type: "input",
    name: "no_kk",
    label: "Nomor kk",
    placeholder: "Nomor KK",
    colSpan: "col-span-2",
    layout: "horizontal",
  },
  {
    type: "input",
    name: "no_pasport",
    label: "Nomor Pasport",
    placeholder: "Nomor Pasport",
    colSpan: "col-span-2",
    layout: "horizontal",
  },
  {
    type: "input",
    name: "fullname",
    label: "Nama",
    placeholder: "Nama",
    colSpan: "col-span-2",
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "input",
    name: "nama_ibu",
    label: "Nama Ibu Kandung",
    placeholder: "Nama Ibu Kandung",
    colSpan: "col-span-2",
    layout: "horizontal",
  },
  {
    type: "date",
    name: "first_visit",
    label: "Kunjungan pertama",
    placeholder: "dd/mm/yyyy",
    colSpan: "col-span-2",
    layout: "horizontal",
  },
];

export const getDataPasienFields = (
  agama,
  golonganDarah,
  sukuBangsa,
  pekerjaan,
  listPendidikan
) => [
  {
    type: "input",
    name: "place_ob",
    label: "Tempat Lahir",
    placeholder: "Tempat Lahir",
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "date",
    name: "date_ob",
    label: "Tanggal Lahir",
    placeholder: "dd/mm/yyyy",
    showTodayButton: true,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "combobox",
    name: "blood_type",
    label: "Golongan Darah",
    placeholder: "Pilih",
    options: golonganDarah,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "radio",
    name: "gender",
    options: [
      { label: "Laki-Laki", value: 1 },
      { label: "Perempuan", value: 2 },
    ],
    layout: "horizontal",
  },
  {
    type: "input",
    name: "namaayah",
    label: "Nama Ayah",
    placeholder: "Nama Ayah",
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "combobox",
    name: "statuspernikahan",
    label: "Status Pernikahan",
    placeholder: "Pilih",
    options: optionsStatusPernikahan,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "combobox",
    name: "ethnic",
    label: "Suku bangsa",
    placeholder: "Pilih",
    options: sukuBangsa,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "input",
    name: "mobile_phone_number",
    label: "No Hp",
    placeholder: "No Hp",
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "input",
    name: "phone_number",
    label: "No Telepon",
    placeholder: "No Telepon",
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "combobox",
    name: "religion",
    label: "Agama",
    placeholder: "Pilih",
    options: agama,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "combobox",
    name: "education",
    label: "Pendidikan",
    placeholder: "Pilih",
    options: listPendidikan,
    layout: "horizontal",
  },
  {
    type: "combobox",
    name: "occupation",
    label: "Pekerjaan",
    placeholder: "Pilih",
    options: pekerjaan,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "input",
    name: "nip",
    label: "NIP",
    placeholder: "NIP",
    layout: "horizontal",
  },
  {
    type: "input",
    name: "npwp",
    label: "NPWP",
    placeholder: "NPWP",
    layout: "horizontal",
  },
];

export const getAlamatFields = (
  listNegara,
  provinsi,
  kota,
  kecamatan,
  kelurahan,
  setValue,
  getValues
) => [
  {
    type: "input",
    name: "address_ktp",
    label: "Alamat KTP",
    placeholder: "Alamat KTP",
    colSpan: "col-span-2",
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "inputWithCheckbox",
    name: "address_now",
    label: "Alamat Sekarang",
    placeholder: "Masukkan alamat sekarang",
    sameLabel: "Sama Dengan Alamat KTP",
    colSpan: "col-span-2",
    setValue,
    getValues,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "input",
    name: "rt",
    label: "RT",
    placeholder: "RT",
    layout: "horizontal",
  },
  {
    type: "input",
    name: "rw",
    label: "RW",
    placeholder: "RW",
    layout: "horizontal",
  },
  {
    type: "input",
    name: "postal_code",
    label: "Kode Pos",
    placeholder: "Kode Pos",
    layout: "horizontal",
  },
  {
    type: "combobox",
    name: "country",
    label: "Negara",
    placeholder: "Pilih",
    options: listNegara,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "combobox",
    name: "province",
    label: "Provinsi",
    placeholder: "Pilih",
    options: provinsi,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "combobox",
    name: "city",
    label: "Kota",
    placeholder: "Pilih",
    options: kota,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "combobox",
    name: "district",
    label: "Kecamatan",
    placeholder: "Pilih",
    options: kecamatan,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "combobox",
    name: "sub_district",
    label: "Kelurahan",
    placeholder: "Pilih",
    options: kelurahan,
    showRequiredNote: true,
    layout: "horizontal",
  },
];

export const getAsuransiFields = (
  asuransi,
  perusahaanAsuransi,
  setValue,
  getValues
) => [
  {
    type: "combobox",
    name: "company_id",
    label: "Perusahaan",
    placeholder: "Pilih",
    options: perusahaanAsuransi,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "combobox",
    name: "insurance_id",
    label: "Asuransi",
    placeholder: "Pilih",
    options: asuransi,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "input",
    name: "insurance_number",
    label: "No Asuransi / BPJS",
    placeholder: "No Asuransi / BPJS",
    showRequiredNote: true,
    requiredNoteText: "selain umum wajib di isi",
    requiredUnless: "umum",
    withFetchButton: true,
    requireInsuranceId: 2,
    requiredUnless: 1,
    setValue,
    getValues,
    fetchAction: {
      api: (no_kartu) => getDataBPJS(`no_kartu=${no_kartu}`),
      mapResult: (res) => {
        const peserta = res?.data?.peserta;
        return {
          nik: peserta?.nik || "",
        };
      },
    },
    layout: "horizontal",
  },
];

export const getPenanggungJawabFields = (penanggungJawab) => [
  {
    type: "combobox",
    name: "guarantor_connection",
    label: "Penanggung",
    placeholder: "Pilih",
    options: penanggungJawab,
    showRequiredNote: true,
    layout: "horizontal",
  },
  {
    type: "input",
    name: "guarantor_name",
    label: "Nama Penanggung",
    placeholder: "Nama Penanggung",
    showRequiredNote: true,
    layout: "horizontal",
  },
];

export const getMediaSosialFields = () => [
  {
    type: "input",
    name: "sc_whatsapp",
    label: "Whatsapp",
    placeholder: "Whatsapp",
    layout: "horizontal",
  },
  {
    type: "input",
    name: "sc_email",
    label: "Email",
    placeholder: "Email",
    layout: "horizontal",
  },
  {
    type: "input",
    name: "sc_instagram",
    label: "Instagram",
    placeholder: "Instagram",
    layout: "horizontal",
  },
  {
    type: "input",
    name: "sc_facebook",
    label: "Facebook",
    placeholder: "Facebook",
    layout: "horizontal",
  },
];

export const getProfileRekamMedisCheckboxes = () => [
  {
    name: "status",
    label: "Aktif",
  },
];
