import z from "zod";

export const pendidikanSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),

});

export const getPendidikanFields = () => [
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
  },
];
