import z from "zod";

export const bedSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  kelas_id: z.number({
    required_error: "Kelas wajib diisi",
    invalid_type_error: "Kelas wajib diisi",
  }),
  kelaskamarsirsonline: z.number({
    required_error: "Kelas Kamar Sirs Online wajib diisi",
    invalid_type_error: "Kelas Kamar Sirs Online wajib diisi",
  }),
  gol_golongankelasaplicares: z.number({
    required_error: "Golongan wajib diisi",
    invalid_type_error: "Golongan wajib diisi",
  }),
  ruang_aplicares: z.string({
    required_error: "Ruangan wajib diisi",
    invalid_type_error: "Ruangan wajib diisi",
  }),
  kamar_id: z.number({
    required_error: "Kamar wajib diisi",
    invalid_type_error: "Kamar wajib diisi",
  }),
  jenis_layanan_id: z.number({
    required_error: "Jenis Layanan wajib diisi",
    invalid_type_error: "Jenis Layanan wajib diisi",
  }),
  remark: z.string().optional().or(z.literal("")),
  icekbridging: z.boolean().default(true),
  status: z.boolean().default(true),
  icekbridging_sirsonline: z.boolean().default(true),
});

export const searchBedSchema = z.object({
  name: z.string().optional(),
  kelas_id: z.number().nullable().optional(),
  kelaskamarsirsonline: z.number().nullable().optional(),
  gol_golongankelasaplicares: z.number().nullable().optional(),
  ruang_aplicares: z.string().nullable().optional(),
  kamar_id: z.number().nullable().optional(),
  jenis_layanan_id: z.number().nullable().optional(),
});

export const getBedFields = (
  listBed,
  aplicares,
  rsOnline,
  ruangAplicares,
  kamar,
  tempatTidurRl
) => [
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
    colSpan: "col-span-6",
  },
  {
    type: "combobox",
    name: "kelas_id",
    label: "Kelas kamar aplicares",
    placeholder: "Pilih",
    options: listBed,
    colSpan: "col-span-6",
  },
  {
    type: "combobox",
    name: "kelaskamarsirsonline",
    label: "Kelas Kamar sirs online",
    placeholder: "Pilih",
    options: rsOnline,
    colSpan: "col-span-6",
  },
  {
    type: "combobox",
    name: "gol_golongankelasaplicares",
    label: "gol kelas Aplicare",
    placeholder: "Pilih",
    colSpan: "col-span-6",
    options: aplicares,
  },
  {
    type: "combobox",
    name: "ruang_aplicares",
    label: "ruang aplicare",
    placeholder: "Pilih",
    options: ruangAplicares,
    colSpan: "col-span-6",
  },
  {
    type: "combobox",
    name: "kamar_id",
    label: "kamar",
    placeholder: "Pilih",
    options: kamar,
    colSpan: "col-span-6",
  },
  {
    type: "combobox",
    name: "jenis_layanan_id",
    label: "tempat tidur rl",
    placeholder: "Pilih",
    options: tempatTidurRl,
    colSpan: "col-span-6",
  },
];

export const getBedSearchFields = (
  listBed,
  ruangAplicares,
  kamar
) => [
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
  },
  {
    type: "combobox",
    name: "kelas_id",
    label: "Kelas kamar aplicares",
    placeholder: "Pilih",
    options: listBed,
  },
  {
    type: "combobox",
    name: "ruang_aplicares",
    label: "ruang aplicare",
    placeholder: "Pilih",
    options: ruangAplicares,
  },
  {
    type: "combobox",
    name: "kamar_id",
    label: "kamar",
    placeholder: "Pilih",
    options: kamar,
  },
];

export const getBedCheckboxes = () => [
  {
    name: "icekbridging",
    label: "Bridging Aplicare",
  },
  {
    name: "status",
    label: "Aktif",
  },
  {
    name: "icekbridging_sirsonline",
    label: "Bridging Sirs Online",
  },
];
