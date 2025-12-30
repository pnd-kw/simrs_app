import z from "zod";
import PopupDialogHistoriBed from "./PopupDialogHistoriBed";
import { format } from "date-fns";

export const defaultFormValuesHistoriBed = {
  id_kunjungan: "",
  id_rm: "",
  patient_name: "",
  bed_name: "",
  kamar_name: "",
  kelas_name: "",
  date_waiting: null,
  date_start: null,
  date_estimated_discharge: null,
};

export const HistoriBedSchema = z.object({
  date_start: z
    .union([z.string(), z.date()])
    .transform((val) =>
      typeof val === "string" ? val : format(val, "yyyy-MM-dd")
    )
    .refine((val) => val !== "", { message: "Tanggal wajib diisi" }),
  date_estimated_discharge: z
    .union([z.string(), z.date()])
    .transform((val) =>
      typeof val === "string" ? val : format(val, "yyyy-MM-dd")
    )
    .refine((val) => val !== "", { message: "Tanggal wajib diisi" }),
});

export const getHistoriBedFields = (setValue, open) => [
  {
    type: "input",
    name: "id_kunjungan",
    label: "ID Kunjungan",
    placeholder: "ID Kunjungan",
    colSpan: "col-span-2",
    layout: "horizontal",
    disabled: true,
  },
  {
    type: "input",
    name: "id_rm",
    label: "ID RM",
    placeholder: "ID RM",
    colSpan: "col-span-2",
    layout: "horizontal",
    disabled: true,
  },
  {
    type: "input",
    name: "patient_name",
    label: "Nama RM",
    placeholder: "Nama RM",
    colSpan: "col-span-2",
    layout: "horizontal",
    disabled: true,
  },
  {
    type: "withPopup",
    name: "bed_name",
    label: "Bed",
    placeholder: "Masukkan Cari Bed",
    colSpan: "col-span-2",
    layout: "horizontal",
    disabled: true,
    setValue,
    open,
    withPopup: {
      title: "Bed",
      component: PopupDialogHistoriBed,
    },
    icon: "mingcute:search-line",
  },
  {
    type: "input",
    name: "kamar_name",
    label: "Kamar",
    placeholder: "Kamar",
    colSpan: "col-span-2",
    layout: "horizontal",
    disabled: true,
  },
  {
    type: "input",
    name: "kelas_name",
    label: "Kelas Kamar",
    placeholder: "Kelas Kamar",
    colSpan: "col-span-2",
    layout: "horizontal",
    disabled: true,
  },
  {
    type: "date",
    name: "date_waiting",
    label: "Tanggal Waiting",
    placeholder: "dd/mm/yyyy",
    colSpan: "col-span-2",
    layout: "horizontal",
    disabledAll: true,
  },
  {
    type: "date",
    name: "date_start",
    label: "Tanggal Masuk",
    placeholder: "dd/mm/yyyy",
    colSpan: "col-span-2",
    layout: "horizontal",
    showTodayButton: true,
  },
  {
    type: "date",
    name: "date_estimated_discharge",
    label: "Tanggal Keluar",
    placeholder: "dd/mm/yyyy",
    colSpan: "col-span-2",
    layout: "horizontal",
    showTodayButton: true,
  },
];
