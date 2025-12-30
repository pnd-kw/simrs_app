import { optionsStatus } from "@/utils/static_options/staticData";

export const defaultFormValuesSearchProfileRekamMedis = {
  id: "",
  nama: "",
  nik: "",
  alamat: "",
  tgl_lahir: null,
  tanggal_mulai: null,
  tanggal_selesai: null,

  status: "all",
};

export const getSearchProfileRMFields = () => [
  {
    type: "input",
    name: "id",
    label: "ID RM",
    placeholder: "ID RM",
    layout: "horizontal",
  },
  {
    type: "input",
    name: "nama",
    label: "Nama",
    placeholder: "Nama",
    layout: "horizontal",
  },
  {
    type: "input",
    name: "nik",
    label: "NIK",
    placeholder: "NIK",
    layout: "horizontal",
  },
  {
    type: "input",
    name: "alamat",
    label: "Alamat",
    placeholder: "Alamat",
    layout: "horizontal",
  },
  {
    type: "date",
    name: "tgl_lahir",
    label: "Tanggal Lahir",
    placeholder: "dd/mm/yyyy",
    showTodayButton: true,
    layout: "horizontal",
  },
  {
    type: "combobox",
    name: "status",
    label: "Status",
    placeholder: "Pilih",
    options: optionsStatus,
    layout: "horizontal",
  },
  {
    type: "date",
    name: "tanggal_mulai",
    label: "Tanggal Mulai",
    placeholder: "dd/mm/yyyy",
    showTodayButton: true,
    layout: "horizontal",
  },
  {
    type: "date",
    name: "tanggal_selesai",
    label: "Tanggal Selesai",
    placeholder: "dd/mm/yyyy",
    showTodayButton: true,
    layout: "horizontal",
  },
];
