import z from "zod";

export const asuransiSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  phone: z.string().min(1, { message: "No HP wajib diisi" }),
  address: z.string().min(1, { message: "Alamat wajib diisi" }),
  no_virtual_account: z.string().optional(),
  nama_virtual_account: z.string().optional(),
  nama_bank: z.string().optional(),
  contactperson: z.string().optional(),
  cpphone: z.string().optional(),
  cpmobilephone: z.string().optional(),
  cpemail: z.string().optional(),
  cpaddress: z.string().optional(),
  harga_id: z.number().optional(),
  insurance_type_id: z.number().optional(),
  remark: z.string().optional().or(z.literal("")),
});

export const getAsuransiFields = (optionsJenisHarga, optionsTipeAsuransi) => [
  {
    type: "input",
    name: "name",
    label: "Nama",
    placeholder: "Nama",
    colSpan: "col-span-2",
    showRequiredNote: true,
  },
  {
    type: "input",
    name: "phone",
    label: "No Tlp Perusahaan",
    placeholder: "No Tlp Perusahaan",
    colSpan: "col-span-2",
    showRequiredNote: true,
  },
  {
    type: "combobox",
    name: "harga_id",
    label: "Jenis Harga",
    placeholder: "Pilih",
    options: optionsJenisHarga,
    colSpan: "col-span-2",
  },
  {
    type: "input",
    name: "address",
    label: "Alamat",
    placeholder: "Alamat",
    colSpan: "col-span-4",
    showRequiredNote: true,
  },
  {
    type: "combobox",
    name: "insurance_type_id",
    label: "tipe asuransi",
    placeholder: "Pilih",
    options: optionsTipeAsuransi,
    colSpan: "col-span-2",
  },
];

export const getVaFields = (optionsBank) => [
  {
    type: "combobox",
    name: "nama_bank",
    label: "Bank",
    placeholder: "Pilih",
    colSpan: "col-span-2",
    options: optionsBank,
  },
  {
    type: "input",
    name: "no_virtual_account",
    label: "No Virtual Account",
    placeholder: "No Virtual Account",
    colSpan: "col-span-2",
    showRequiredNote: true,
  },
  {
    type: "input",
    name: "nama_virtual_account",
    label: "Nama Virtual Account",
    placeholder: "Nama Virtual Account",
    colSpan: "col-span-2",
    showRequiredNote: true,
  },
];

export const getKontakPersonFields = () => [
  {
    type: "input",
    name: "contactperson",
    label: "Nama",
    placeholder: "Nama",
    colSpan: "col-span-2",
    showRequiredNote: true,
  },
  {
    type: "input",
    name: "cpphone",
    label: "No. Telepon KP",
    placeholder: "No. Telepon KP",
    colSpan: "col-span-2",
    showRequiredNote: true,
  },
  {
    type: "input",
    name: "cpmobilephone",
    label: "No. Mobile Phone",
    placeholder: "No. Mobile Phone",
    colSpan: "col-span-2",
    showRequiredNote: true,
  },
  {
    type: "input",
    name: "cpemail",
    label: "Email KP",
    colSpan: "col-span-2",
    placeholder: "Email KP",
    showRequiredNote: true,
  },
  {
    type: "input",
    name: "cpaddress",
    label: "Alamat KP",
    placeholder: "Alamat KP",
    colSpan: "col-span-4",
    showRequiredNote: true,
  },
];
