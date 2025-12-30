import z from "zod";

export const tipeRegistrasiSchema = z.object({
  judul: z
    .string()
    .min(1, { message: "Judul wajib diisi" })
    .max(100, { message: "Judul maksimal 100 karakter" }),
  kode: z
    .string()
    .min(1, { message: "Kode wajib diisi" })
    .max(50, { message: "Kode maksimal 50 karakter" }),
  remark: z.string().optional().or(z.literal("")),
});

export const getTipeRegistrasiFields = () => [
  {
    type: "input",
    name: "kode",
    label: "Kode",
  },
  {
    type: "input",
    name: "judul",
    label: "Judul",
  },
  {
    type: "input",
    name: "remark",
    label: "Remark",
  },
];
