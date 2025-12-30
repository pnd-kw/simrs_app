export const defaultFormValuesMonitoringBed = {
  bed_id: "",
  nama_bed: "",
  nama_kamar: "",
  nama_kelas: "",

  id_registrasi: "",
  tanggal_kunjungan: null,
  date_waiting: null,
  no_rm: "",
  nama_pasien: "",
  nama_kelas_kunjungan: "",
  date_start: null,
  rencana_pulang: null,

  remark: "",
};

export const getMonitoringBedDataBedFields = () => [
  {
    type: "input",
    name: "bed_id",
    label: "ID BED",
    placeholder: "ID BED",
    disabled: true,
  },
  {
    type: "input",
    name: "nama_bed",
    label: "BED",
    placeholder: "BED",
    disabled: true,
  },
  {
    type: "input",
    name: "nama_kamar",
    label: "RUANG",
    placeholder: "RUANG",
    disabled: true,
  },
  {
    type: "input",
    name: "nama_kelas",
    label: "Kelas",
    placeholder: "Kelas",
    disabled: true,
  },
];

export const getMonitoringBedDataKunjunganFields = () => [
  {
    type: "input",
    name: "id_registrasi",
    label: "ID Kunjungan",
    placeholder: "ID Kunjungan",
    disabled: true,
  },
  {
    type: "date",
    name: "tanggal_kunjungan",
    label: "Tanggal Kunjungan",
    placeholder: "dd/mm/yyyy",
    disabledAll: true,
  },
  {
    type: "date",
    name: "date_waiting",
    label: "Tanggal Waiting",
    placeholder: "dd/mm/yyyy",
    disabledAll: true,
  },
  {
    type: "input",
    name: "no_rm",
    label: "ID RM",
    placeholder: "ID RM",
    disabled: true,
  },
  {
    type: "input",
    name: "nama_pasien",
    label: "NAMA RM",
    placeholder: "NAMA RM",
    disabled: true,
  },
  {
    type: "input",
    name: "nama_kelas_kunjungan",
    label: "KELAS",
    placeholder: "KELAS",
    disabled: true,
  },
  {
    type: "date",
    name: "date_start",
    label: "Tanggal Masuk",
    placeholder: "dd/mm/yyyy",
    disabledAll: true,
  },
  {
    type: "date",
    name: "rencana_pulang",
    label: "Rencana Pulang",
    placeholder: "dd/mm/yyyy",
    disabledAll: true,
  },
  {
    type: "input",
    name: "remark",
    label: "CATATAN",
    placeholder: "CATATAN",
  },
];
