import { optionsSearchColumn } from "@/utils/static_options/staticData";

export const getDialogSearchRanapSheetFields = () => [
  {
    type: "combobox",
    name: "search_column.0",
    label: "Kategori Pencarian",
    placeholder: "Kategori Pencarian",
    options: optionsSearchColumn,
  },
  {
    type: "input",
    name: "search_text.0",
    label: "Kata Kunci",
    placeholder: "Kata Kunci",
  },
  {
    type: "date",
    name: "tanggal_mulai",
    label: "Tanggal Mulai",
    placeholder: "dd/mm/yyyy",
    showTodayButton: true,
  },
  {
    type: "date",
    name: "tanggal_selesai",
    label: "Tanggal Selesai",
    placeholder: "dd/mm/yyyy",
    showTodayButton: true,
  },
];
