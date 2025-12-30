import z from "zod";

export const poliklinikSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  no_poli: z.string().min(1, { message: "No Poli wajib diisi" }),
  code: z.string().min(1, { message: "Code wajib diisi" }),
  poli_schedule_id: z.number().optional(),
  kodebridge: z.string().optional(),
  remark: z.string().optional(),
  status: z.boolean().default(true).optional(),
});

export const getPoliklinikFields = () => [
  {
    type: "input",
    name: "code",
    label: "Kode",
    placeholder: "Kode",
    colSpan: "col-span-2",
  },
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
    colSpan: "col-span-2",
  },
  {
    type: "input",
    name: "no_poli",
    label: "No Poli",
    placeholder: "No Poli",
    colSpan: "col-span-2",
  },
];

export const getPoliklinikCheckboxes = () => [
  {
    name: "status",
    label: "Aktif",
  },
];
