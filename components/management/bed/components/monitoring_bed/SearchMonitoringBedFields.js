import {
  optionsStatusBed,
  optionsStatusWaiting,
} from "@/utils/static_options/staticData";

export const getSearchMonitoringBedFields = () => [
  {
    type: "input",
    name: "id_kunjungan",
    label: "ID Kunjungan",
    placeholder: "ID Kunjungan",
  },
  {
    type: "input",
    name: "nama_rm",
    label: "Nama RM",
    placeholder: "Nama RM",
  },
  {
    type: "input",
    name: "no_rm",
    label: "NO RM",
    placeholder: "NO RM",
  },
  {
    type: "date",
    name: "tanggal_rencana_pulang",
    label: "tanggal rencana pulang",
    placeholder: "dd/mm/yyyy",
    showTodayButton: true,
  },
  {
    type: "input",
    name: "alamat",
    label: "Alamat",
    placeholder: "Alamat",
  },
  {
    type: "combobox",
    name: "status_waiting",
    label: "Status waiting",
    placeholder: "Pilih",
    options: optionsStatusWaiting,
  },
];

export const getSearchMonitoringBedFieldsTwo = (beds, kamar, ruangList) => [
  {
    type: "combobox",
    name: "kondisi_bed",
    label: "kondisi bed",
    placeholder: "Pilih",
    options: optionsStatusBed,
  },
  {
    type: "combobox",
    name: "bed",
    label: "Bed",
    placeholder: "Pilih",
    options: beds,
  },
  {
    type: "combobox",
    name: "ruang",
    label: "Ruang",
    placeholder: "Pilih",
    options: ruangList,
  },
  {
    type: "combobox",
    name: "kamar",
    label: "Kamar",
    placeholder: "Pilih",
    options: kamar,
  },
];
