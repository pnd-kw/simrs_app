import z from "zod";

export const kamarSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  ruang_id: z.number({
    required_error: "Ruang wajib diisi",
    invalid_type_error: "Ruang wajib diisi",
  }),
  remark: z.string().optional().or(z.literal("")),
});

export const getKamarFields = (ruangan) => [
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
  },
  {
    type: "combobox",
    name: "ruang_id",
    label: "Ruang",
    placeholder: "Pilih",
    options: ruangan,
  },
];
