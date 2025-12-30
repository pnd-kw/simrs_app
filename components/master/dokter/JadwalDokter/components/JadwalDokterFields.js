import z from "zod";

export const jadwalDokterSchema = z.object({
  doctor_id: z.number().min(1, { message: "Dokter wajib diisi" }),
  layanan_id: z.number().min(1, { message: "Layanan wajib diisi" }),
  poli_code: z.string().min(1, { message: "Poliklinik wajib diisi" }),
  day: z.string().optional(),
  time_start: z.string().optional(),
  time_finish: z.string().optional(),
  waktu_pelayanan_per_pasien: z.string().optional(),
  karakter_antrian: z.string().optional(),
  quota: z.number().optional(),
  quota_jkn: z.number().optional(),
  quota_vip: z.number().optional(),
  status: z.boolean().default(true).optional(),
  bridging_hfis: z.boolean().default(false).optional(),
});

export const optionsHari = [
  { value: "monday", label: "Senin", id: 1 },
  { value: "tuesday", label: "Selasa", id: 2 },
  { value: "wednesday", label: "Rabu", id: 3 },
  { value: "thursday", label: "Kamis", id: 4 },
  { value: "friday", label: "Jumat", id: 5 },
  { value: "saturday", label: "Sabtu", id: 6 },
  { value: "sunday", label: "Minggu", id: 7 },
];

export const getJadwalDokterFields = (
  optionsLinkLayanan,
  optionsLinkPoliklinik
) => [
  {
    type: "combobox",
    name: "layanan_id",
    label: "Layanan",
    placeholder: "Pilih",
    options: optionsLinkLayanan,
    colSpan: "col-span-3",
    showRequiredNote: true,
  },
  {
    type: "combobox",
    name: "poli_code",
    label: "Poliklinik",
    placeholder: "Pilih",
    options: optionsLinkPoliklinik,
    colSpan: "col-span-3",
    showRequiredNote: true,
  },
];

export const getDetailJadwalFields = () => [
  {
    type: "combobox",
    name: "day",
    label: "Hari",
    placeholder: "Pilih",
    options: optionsHari,
    colSpan: "col-span-2",
  },
  {
    name: "time_start",
    label: "Jam Mulai",
    type: "time",
    colSpan: "col-span-1",
  },
  {
    name: "time_finish",
    label: "Jam Mulai",
    type: "time",
    colSpan: "col-span-1",
  },
  {
    name: "waktu_pelayanan_per_pasien",
    label: "Waktu Pelayanan Per Pasien",
    type: "input",
    placeholder: "Dalam Menit",
    colSpan: "col-span-2",
  },
  {
    name: "karakter_antrian",
    label: "Karakter Antrian",
    type: "input",
    placeholder: "Karakter Antrian",
    colSpan: "col-span-2",
    disabled: true,
  },
  {
    name: "quota",
    label: "Kuota Dokter",
    type: "input",
    placeholder: "Kuota Dokter",
    colSpan: "col-span-1",
  },
  {
    name: "quota_jkn",
    label: "Kuota JKN",
    type: "input",
    placeholder: "Kuota JKN",
    colSpan: "col-span-1",
  },
  {
    name: "quota_vip",
    label: "Kuota VIP",
    type: "input",
    placeholder: "Kuota VIP",
    colSpan: "col-span-2",
  },
];

export const getJadwalDokterCheckboxes = () => [
  {
    name: "status",
    label: "Aktif",
  },
  {
    name: "bridging_hfis",
    label: "Bridging HFIS",
  },
];
