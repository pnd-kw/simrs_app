import z from "zod";

export const ruangLayananSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  initial: z
    .string()
    .min(1, { message: "Nama wajib diisi" }),
  layanan_id: z.number({
    required_error: "Tarif wajib diisi",
  }),
  remark: z.string().optional().or(z.literal("")),
  status: z.boolean().default(true),
});

export const getRuangLayananFields = (listJenisLayanan) => [
  {
    type: "combobox",
    name: "layanan_id",
    label: "Layanan",
    placeholder: "Pilih",
    options: listJenisLayanan,
  },
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
  },
  {
    type: "input",
    name: "initial",
    label: "Initial",
    placeholder: "Initial",
  },
  {
    type: "input",
    name: "remark",
    label: "Remark",
    placeholder: "Remark",
  },
];

export const getRuangLayananCheckboxes = () => [
  {
    name: "status",
    label: "Aktif",
  },
];
