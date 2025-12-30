import z from "zod";

export const MasterJenisHargaSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
});

export const getMasterJenisHargaFields = () => [
  {
    type: "input",
    name: "name",
    label: "Info",
    placeholder: "Nama",
  },
];

export const getMasterJenisHargaCheckboxes = () => [
  {
    name: "isactive",
    label: "Aktif",
  },
];
