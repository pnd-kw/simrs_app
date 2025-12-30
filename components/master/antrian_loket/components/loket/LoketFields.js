import z from "zod";

export const loketSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  sequalize: z.string().min(1, { message: "Sequalize wajib diisi" }),
  status: z.boolean().default(true),
});

export const getLoketFields = () => [
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
  },
  {
    type: "input",
    name: "sequalize",
    label: "Sequalize",
    placeholder: "Sequalize",
  },
];

export const getLoketCheckboxes = () => [
  {
    name: "status",
    label: "Aktif",
  },
];
