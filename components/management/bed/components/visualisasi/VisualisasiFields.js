export const getVisualisasiFields = (kelasKamar, kamar, ruangList) => [
  {
    type: "combobox",
    name: "ruang_id",
    label: "Ruang",
    placeholder: "Pilih",
    options: ruangList,
  },
  {
    type: "combobox",
    name: "kamar_id",
    label: "Kamar",
    placeholder: "Pilih",
    options: kamar,
  },
  {
    type: "combobox",
    name: "kelas_id",
    label: "Bed",
    placeholder: "Pilih",
    options: kelasKamar,
  },
];
