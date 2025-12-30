import z from "zod";

export const textDisplayLoketSchema = z.object({
  judul: z
    .string()
    .min(1, { message: "Judul wajib diisi" })
    .max(100, { message: "Judul maksimal 100 karakter" }),
  text: z.string().min(1, { message: "Text wajib diisi" }),
  duration: z.string().min(1, { message: "Duration wajib diisi" }),
  keterangan: z.string().optional().or(z.literal("")),
  isactive: z.boolean().default(true),
});

export const getTextDisplayLoketFields = () => [
  {
    type: "input",
    name: "judul",
    label: "Judul",
  },
  {
    type: "input",
    name: "text",
    label: "Text",
  },
  {
    type: "input",
    name: "duration",
    label: "Duration",
  },
  {
    type: "input",
    name: "keterangan",
    label: "Keterangan",
  },
];

export const getTextDisplayLoketCheckboxes = () => [
  {
    name: "isactive",
    label: "Aktif",
  },
];
