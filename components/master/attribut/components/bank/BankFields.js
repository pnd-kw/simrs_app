import z from "zod";

export const bankSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),

  remark: z.string().optional().or(z.literal("")),
});

export const getBankFields = () => [
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
