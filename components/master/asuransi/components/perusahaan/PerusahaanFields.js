import z from "zod";

export const perusahaanSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  business: z.string().min(1, { message: "Business wajib diisi" }),
  phone: z.string().min(1, { message: "No HP wajib diisi" }),
  address: z.string().min(1, { message: "Alamat wajib diisi" }),
  no_virtual_account: z.string().optional(),
  nama_virtual_account: z.string().optional(),
  nama_bank: z.number().optional(),
  contactperson: z.string().optional(),
  cpphone: z.string().optional(),
  cpmobilephone: z.string().optional(),
  cpemail: z.string().optional(),
  cpaddress: z.string().optional(),
});

export const getPerusahaanFields = () => [
  {
    type: "input",
    name: "name",
    label: "Nama",
    colSpan: "col-span-2",
    placeholder: "Nama",
    showRequiredNote: true,
  },
  {
    type: "input",
    name: "business",
    label: "Business",
    colSpan: "col-span-2",
    placeholder: "Business",
    showRequiredNote: true,
  },
  {
    type: "input",
    name: "phone",
    colSpan: "col-span-2",
    label: "No Tlp Perusahaan",
    placeholder: "No Tlp Perusahaan",
    showRequiredNote: true,
  },
  {
    type: "input",
    name: "address",
    label: "Alamat",
    placeholder: "Alamat",
    colSpan: "col-span-6",
    showRequiredNote: true,
  },
];

export const getVaFields = (optionsBank) => [
  {
    type: "combobox",
    name: "nama_bank",
    label: "Bank",
    placeholder: "Pilih",
    options: optionsBank,
    colSpan: "col-span-2",
  },
  {
    type: "input",
    name: "no_virtual_account",
    label: "No Virtual Account",
    colSpan: "col-span-2",
    placeholder: "No Virtual Account",
    showRequiredNote: true,
  },
  {
    type: "input",
    name: "nama_virtual_account",
    label: "Nama Virtual Account",
    colSpan: "col-span-2",
    placeholder: "Nama Virtual Account",
    showRequiredNote: true,
  },
];

export const getKontakPersonFields = () => [
  {
    type: "input",
    name: "contactperson",
    label: "Nama",
    colSpan: "col-span-2",
    placeholder: "Nama",
    showRequiredNote: true,
  },
  {
    type: "input",
    name: "cpphone",
    label: "No. Telepon KP",
    colSpan: "col-span-2",
    placeholder: "No. Telepon KP",
    showRequiredNote: true,
  },
  {
    type: "input",
    name: "cpmobilephone",
    label: "No. Mobile Phone",
    colSpan: "col-span-2",
    placeholder: "No. Mobile Phone",
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
