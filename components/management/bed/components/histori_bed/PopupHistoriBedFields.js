export const getPopupHistoriBedFields = (kamar, kelasKamar) => [
  {
    type: "input",
    name: "id",
    label: "ID",
    placeholder: "ID",
  },
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
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
    label: "Kelas Kamar",
    placeholder: "Pilih",
    options: kelasKamar,
  },
];
