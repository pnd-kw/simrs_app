import z from "zod";

export const kelasKamarSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  id_kelaskunjungan: z.number({
    required_error: "Tarif wajib diisi",
  }),
  remark: z.string().optional().or(z.literal("")),
});

export const getKelasKamarFields = (listKelasKamar) => [
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
  },
  {
    type: "input",
    name: "remark",
    label: "Remark",
    placeholder: "Remark",
  },
    {
    type: "combobox",
    name: "id_kelaskunjungan",
    label: "Kelas Kunjungan",
    placeholder: "Pilih",
    options: listKelasKamar,
  },
];