export const FILTER_NO_KONTROL = [
  {
    key: "Tanggal Entry",
    value: "1",
  },
  {
    key: "Tanggal Rencana Kontrol",
    value: "2",
  },
];

export const STATUS_REGISTRASI = [
  {
    key: "Semua",
    value: "all",
  },
  {
    key: "Sudah Registrasi",
    value: "true",
  },
  {
    key: "Belum Registrasi",
    value: "false",
  },
];

export const ASAL_BOOKING = [
  {
    key: "Semua",
    value: "all",
  },
  {
    key: "Mobile",
    value: "1",
  },
  {
    key: "Onsite",
    value: "2",
  },
  {
    key: "Mobile JKN",
    value: "3",
  },
];

export const STATUS_BOOKING = [
  {
    key: "Semua",
    value: "all",
  },
  {
    key: "Aktif",
    value: "true",
  },
  {
    key: "Tidak Aktif",
    value: "false",
  },
];

export const STATUS_RM = [
  {
    key: "Semua",
    value: "all",
  },
  {
    key: "Aktif",
    value: "true",
  },
  {
    key: "Pending",
    value: "false",
  },
];

export const STATUS_PASIEN = [
  {
    key: "Semua",
    value: "all",
  },
  {
    key: "Aktif",
    value: "true",
  },
  {
    key: "Tidak Aktif",
    value: "false",
  },
];

export const ASAL_RUJUKAN = [
  { key: "Faskes", value: "1" },
  { key: "RS", value: "2" },
];

export const LAKA_LANTAS = [
  {
    key: "Bukan Kecelakaan lalu lintas [BKLL]",
    value: "0",
  },
  {
    key: "KLL dan bukan kecelakaan Kerja [BKK]",
    value: "1",
  },
  {
    key: "KLL",
    value: "2",
  },
  {
    key: "KK",
    value: "3",
  },
];

export const SUPLESI = [
  {
    key: "Ya",
    value: "1",
  },
  {
    key: "Tidak",
    value: "0",
  },
];

export const STATUS_JKN_LEFT_COLUMN = [
  {
    key: "kodebooking",
    value: "Kode Booking",
  },
  {
    key: "kodepoli",
    value: "Kode Poli",
  },
  {
    key: "norekammedis",
    value: "No. RM",
  },
  {
    key: "jampraktek",
    value: "Jam Praktek",
  },
  {
    key: "nokapst",
    value: "No. Kapst",
  },
  {
    key: "tanggal",
    value: "Tanggal",
  },
  {
    key: "estimasidilayani",
    value: "Estimasi Dilayani",
  },
  {
    key: "jeniskunjungan",
    value: "Jenis Kunjungan",
  },
];

export const STATUS_JKN_RIGHT_COLUMN = [
  {
    key: "nik",
    value: "NIK KTP",
  },
  {
    key: "noantrean",
    value: "No. Antrean",
  },
  {
    key: "kodedokter",
    value: "Kode Dokter",
  },
  {
    key: "nohp",
    value: "No. HP",
  },
  {
    key: "nomorreferensi",
    value: "No. Ref",
  },
  {
    key: "jampraktek",
    value: "Jam Praktek",
  },
  {
    key: "tanggaldibuat",
    value: "Tanggal Dibuat",
  },
  {
    key: "sumberdata",
    value: "Sumber Data",
  },
];

export const SEBAB_SAKIT = [
  {
    key: "Bukan Kecelakaan lalu lintas [BKLL]",
    value: 0,
  },
  {
    key: "KLL dan bukan kecelakaan Kerja [BKK]",
    value: 1,
  },
  {
    key: "KLL",
    value: 2,
  },
  {
    key: "KK",
    value: 3,
  },
];

export const CARA_MASUK = [
  {
    key: "Rujukan FKTP",
    value: "gp",
  },
  {
    key: "Rujukan FKRTL",
    value: "hosp-trans",
  },
  {
    key: "Rujukan Spesialis",
    value: "mp",
  },
  {
    key: "Dari Rawat Jalan",
    value: "outp",
  },
  {
    key: "Dari Rawat Inap",
    value: "inp",
  },
  {
    key: "Dari Rawat Darurat",
    value: "emd",
  },
  {
    key: "Lahir di RS",
    value: "born",
  },
  {
    key: "Rujukan Panti Jompo",
    value: "nursing",
  },
  {
    key: "Rujukan dari RS Jiwa",
    value: "psych",
  },
  {
    key: "Rujukan Fasilitas Rehab",
    value: "rehab",
  },
  {
    key: "Lain-lain",
    value: "other",
  },
];

export const JENIS_KUNJUNGAN = [
  {
    key: "Pasien Non BPJS",
    value: 0,
  },
  {
    key: "Rujukan FKTP",
    value: 1,
  },
  {
    key: "Rujukan Internal",
    value: 2,
  },
  {
    key: "Kontrol",
    value: 3,
  },
  {
    key: "Rujukan Antar RS",
    value: 4,
  },
];

export const JENIS_ANTRIAN = [
  {
    key: 1,
    value: "Poliklinik",
  },
  {
    key: 2,
    value: "Layanan",
  },
];

export const SEARCH_COLUMN = [
  { key: "Semua", value: "all" },
  { key: "ID RM", value: "no_rm" },
  { key: "ID Kunjungan", value: "kunjungan_id" },
  { key: "Nama", value: "nama_pasien" },
  { key: "ID Tagihan", value: "tagihan_id" },
  { key: "No Asuransi", value: "insurance_no" },
  { key: "No SEP", value: "no_sep" },
  { key: "Created By", value: "createdName" },
];

export const TYPE_RM = [
  {
    key: "Semua",
    value: "all",
  },
  {
    key: "RM INTERNAL",
    value: "true",
  },
  {
    key: "RM EXTERNAL",
    value: "false",
  },
];

export const STATUS = [
  {
    key: "Semua",
    value: "all",
  },
  {
    key: "AKTIF",
    value: "true",
  },
  {
    key: "TIDAK AKTIF",
    value: "false",
  },
];

export const BATAL = [
  {
    key: "Semua",
    value: "all",
  },
  {
    key: "TIDAK DIBATALKAN",
    value: "false",
  },
  {
    key: "BATAL",
    value: "true",
  },
];

export const TUJUAN_KUNJUNGAN = [
  {
    key: "Normal",
    value: 0,
  },
  {
    key: "Prosedur",
    value: 1,
  },
  {
    key: "Kontrol Dokter",
    value: 2,
  },
  {
    key: "Rujuk Internal",
    value: 3,
  },
  {
    key: "Fisio",
    value: 4,
  },
];
