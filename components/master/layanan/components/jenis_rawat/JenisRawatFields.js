import z from "zod";

export const JenisRawatSchema = z.object({
  code: z.string().min(1, { message: "Code wajib diisi" }),
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
});

export const getJenisRawatFields = () => [
  {
    type: "input",
    name: "code",
    label: "Kode",
    placeholder: "Kode",
  },
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
  },
];

export const getJenisRawatCheckboxes = () => [
  {
    name: "isactive",
    label: "Aktif",
  },
];
