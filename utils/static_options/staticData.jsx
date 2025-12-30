export const optionsJenisKontrol = [
  { value: 1, label: "Rawat Inap" },
  { value: 2, label: "Rawat Jalan" },
];

export const optionsStatusEklaim = [
  { value: 1, label: "Proses Verifikasi" },
  { value: 2, label: "Pending Verifikasi" },
  { value: 3, label: "Klaim" },
];

export const optionsStatusPernikahan = [
  { value: "Menikah", label: "Menikah" },
  { value: "Belum Menikah", label: "Belum Menikah" },
  { value: "Cerai Mati", label: "Cerai Mati" },
  { value: "Cerai Hidup", label: "Cerai Hidup" },
];

export const optionsStatus = [
  { value: "true", label: "Aktif" },
  { value: "false", label: "Tidak Aktif" },
  { value: "all", label: "Semua" },
];

export const optionsStatusActive = [
  { value: true, label: "Aktif" },
  { value: false, label: "Tidak Aktif" },
];

export const optionsSearchColumn = [
  { value: "all", label: "Semua" },
  { value: "nama_pasien", label: "Nama Pasien" },
  { value: "no_rm", label: "No Rm" },
  { value: "kunjungan_id", label: "Kunjungan ID" },
  { value: "tagihan_id", label: "Tagihan ID" },
  { value: "insurance_no", label: "No Asuransi" },
  { value: "no_sep", label: "No SEP" },
  { value: "createdName", label: "Nama Pembuat" },
];

export const optionsStatusWaiting = [
  { value: "0", label: "Tidak Terdapat Waiting List" },
  { value: "1", label: "Terdapat Waiting List" },
  { value: "all", label: "Semua" },
];

export const optionsStatusBed = [
  {
    value: "all",
    label: "Semua",
  },
  {
    value: "1",
    label: "Belum Siap",
  },
  {
    value: "2",
    label: "Siap",
  },
  {
    value: "3",
    label: "Terpakai",
  },
];

export const optionsJenisDisplay = [
  { value: 0, label: "Display Loket" },
  { value: 1, label: "Display Poli" },
  { value: 2, label: "Display Layanan" },
  { value: 3, label: "Display Kasir" },
  { value: 4, label: "Display Farmasi" },
  { value: 5, label: "Cek in Farmasi" },
  { value: 6, label: "Cek in Laboratorium" },
];