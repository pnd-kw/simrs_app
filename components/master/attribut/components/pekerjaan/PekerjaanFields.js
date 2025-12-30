import z from "zod";

export const penanggungJawabSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),

});

export const getPenanggungJawabFields = () => [
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
  },
];
