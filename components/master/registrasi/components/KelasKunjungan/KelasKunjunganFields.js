import z from "zod";

export const kelasKunjunganSchema = z.object({
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

export const getKelasKunjunganFields = (listTarif) => [
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
  },
  {
    type: "combobox",
    name: "tarif_id",
    label: "Tarif",
    placeholder: "Pilih",
    options: listTarif,
  },
  {
    type: "input",
    name: "remark",
    label: "Remark",
    placeholder: "Remark",
  },
];

export const getKelasKunjunganCheckboxes = () => [
  {
    name: "isactive",
    label: "Aktif",
  },
];
