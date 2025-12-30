import z from "zod";

export const golRsOnlineSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  kodebridgingsirs: z
    .string()
    .min(1, { message: "Kode wajib diisi" })
    .max(100, { message: "Kode maksimal 100 karakter" }),
  remark: z.string().optional().or(z.literal("")),
});

export const getGolRsOnlineFields = () => [
  {
    type: "input",
    name: "kodebridgingsirs",
    label: "Kode",
    placeholder: "Kode",
  },
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
];
