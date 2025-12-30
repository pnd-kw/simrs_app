import z from "zod";

export const golonganDarahSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),

});

export const getGolonganDarahFields = () => [
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
  },
];
