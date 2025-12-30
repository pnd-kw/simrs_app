import z from "zod";

export const LayananSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  tarif_id: z.number({
    required_error: "Tarif wajib diisi",
  }),
  remark: z.string().optional().or(z.literal("")),
  isactive: z.boolean().default(true),
});

export const getLayananFields = () => [
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
    name: "spesific_code",
    label: "Kode Spesifik",
    placeholder: "Kode Spesifik",
  },
  {
    type: "input",
    name: "remark",
    label: "Remark",
    placeholder: "Remark",
  },
];

export const getLayananCheckboxes = () => [
  {
    name: "isactive",
    label: "Aktif",
  },
];
