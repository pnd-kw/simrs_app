import z from "zod";

export const searchSchema = z.object({
  fullname: z.string().optional(),
  id_ihs: z.string().optional(),
  poliklinik_id: z.number().optional().nullable(),
  spec_code: z.number().optional().nullable(),
  status: z.boolean().default(true).optional(),
});

export const getSearchJadwalFieldsDialog = (
  listSpesialis,
) => [
  {
    type: "input",
    name: "fullname",
    label: "Nama",
    placeholder: "Nama",
    colSpan: "col-span-2",
  },
  {
    type: "input",
    name: "id_ihs",
    label: "ID Satu Sehat",
    placeholder: "ID Satu Sehat",
    colSpan: "col-span-2",
  },
  {
    type: "combobox",
    name: "poliklinik_id",
    label: "Poliklinik",
    placeholder: "Pilih",
    options: listSpesialis,
    colSpan: "col-span-2",
  },
  {
    type: "combobox",
    name: "status",
    label: "Status",
    placeholder: "Pilih",
    options: status,
    colSpan: "col-span-2",
  },
];