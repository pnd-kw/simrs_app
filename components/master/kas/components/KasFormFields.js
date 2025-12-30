import z from "zod";

export const kasSchema = z.object({
  nama: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  id_coa: z.string({
    required_error: "COA wajib diisi",
    invalid_type_error: "COA wajib diisi",
  }),
  jumlah: z.string().min(1, { message: "Jumlah wajib diisi" }),
  no_rek: z.string().min(1, { message: "No. Rekening wajib diisi" }),
  no_hp: z.string().optional().or(z.literal("")),
  telepon: z.string().optional().or(z.literal("")),
  no_contact_person: z.string().min(1, { message: "No. Kontak wajib diisi" }),
  remark: z.string().optional().or(z.literal("")),
  is_bayar_saldo: z.boolean().default(true),
  is_penjualan: z.boolean().default(true),
  is_bayar_tagihan: z.boolean().default(true),
});

export const getKasFields = (listCoa) => [
  {
    type: "input",
    name: "nama",
    label: "Nama",
    placeholder: "Nama",
  },
  {
    type: "combobox",
    name: "id_coa",
    label: "COA",
    placeholder: "Pilih",
    options: listCoa,
  },
  {
    type: "input",
    name: "jumlah",
    label: "Jumlah",
    placeholder: "Jumlah",
  },
  {
    type: "input",
    name: "no_rek",
    label: "NOREK",
    placeholder: "No Rek",
  },
  {
    type: "input",
    name: "no_hp",
    label: "No HP",
    placeholder: "No HP",
  },
  {
    type: "input",
    name: "telepon",
    label: "Telephone",
    placeholder: "Telephone",
  },
  {
    type: "input",
    name: "no_contact_person",
    label: "No Contact Person",
    placeholder: "No Contact Person",
  },
];

export const getKasCheckboxes = () => [
  {
    name: "is_bayar_saldo",
    label: "Pembayaran Saldo",
  },
  {
    name: "is_penjualan",
    label: "Input Penjualan",
  },
  {
    name: "is_bayar_tagihan",
    label: "Pembayaran Tagihan",
  },
];
