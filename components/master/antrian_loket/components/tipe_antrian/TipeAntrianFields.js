import z from "zod";

export const tipeAntrianSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  code: z.string().min(1, { message: "Nama wajib diisi" }),
  display_id: z.number({
    required_error: "Display wajib diisi",
  }),
  remark: z.string().optional().or(z.literal("")),
  status: z.boolean().default(true),
});

export const getTipeAntrianFields = (jenisDisplay) => [
  {
    type: "input",
    name: "name",
    label: "Prefix (jenis antrian)",
    placeholder: "Jenis antrian",
  },
  {
    type: "input",
    name: "code",
    label: "jenis antrian",
    placeholder: "Jenis Antrian",
  },
  {
    type: "combobox",
    name: "display_id",
    label: "pilih display",
    placeholder: "Pilih",
    options: jenisDisplay,
  },
  {
    type: "input",
    name: "remark",
    label: "keterangan",
    placeholder: "Remark",
  },
];

export const getTipeAntrianCheckboxes = () => [
  {
    name: "status",
    label: "Aktif",
  },
];
