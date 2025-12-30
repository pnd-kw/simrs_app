import { todayString } from "@/utils/tanggal/formatDate";
import z from "zod";

export const searchSchema = z.object({
  fullname: z.string().optional(),
  id_ihs: z.string().optional(),
  poliklinik_id: z.number().optional().nullable(),
  spec_code: z.number().optional().nullable(),
  status: z.boolean().default(true).optional(),
});

export const searchHFISSchema = z.object({
  kode_poli: z.number().optional().nullable(),
  tanggal: z
    .string()
    .default(todayString)
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Tanggal tidak valid",
    }),
});

const status = [
  {
    label: "Aktif",
    value: true,
  },
  {
    label: "Tidak Aktif",
    value: false,
  },
];

export const getDetailJadwalFieldsDialog = (
  optionsLinkPoliklinik,
  optionsListSpesialis
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
    options: optionsLinkPoliklinik,
    colSpan: "col-span-2",
  },
  {
    type: "combobox",
    name: "spec_code",
    label: "Spesialis",
    placeholder: "Pilih",
    options: optionsListSpesialis,
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

export const getJadwalHFISFieldsDialog = (listPoliklinik) => [
  {
    type: "combobox",
    name: "kode_poli",
    label: "Kode Poli",
    placeholder: "Pilih",
    options: listPoliklinik,
    colSpan: "col-span-3",
  },
  {
    type: "date",
    name: "tanggal",
    label: "Tanggal",
    placeholder: "dd/mm/yyyy",
    colSpan: "col-span-3",
  },
];
