import z from "zod";

export const poliklinikSpesialisSchema = z.object({
  poli_room_code: z.number().min(1, { message: "Poliklinik wajib diisi" }),
  spec_code: z.number().min(1, { message: "Spesialis wajib diisi" }),
  remark: z.string().optional().or(z.literal("")),
});

export const getPoliklinikSpesialisFields = (listPoliklinik, listSpesialis) => [
  {
    type: "combobox",
    name: "poli_room_code",
    label: "Poliklinik",
    placeholder: "Pilih",
    options: listPoliklinik,
  },
  {
    type: "combobox",
    name: "spec_code",
    label: "spesialis",
    placeholder: "Pilih",
    options: listSpesialis,
  },
  {
    type: "input",
    name: "remark",
    label: "Remark",
    placeholder: "Remark",
  },
];
