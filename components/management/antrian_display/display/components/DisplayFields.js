import {
  optionsJenisDisplay,
  optionsStatusActive,
} from "@/utils/static_options/staticData";
import z from "zod";

export const managementDisplaySchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  jenis_id: z.number({
    required_error: "Display wajib diisi",
    invalid_type_error: "Display wajib diisi",
  }),
  text_id: z.number({
    required_error: "Text wajib diisi",
    invalid_type_error: "Text wajib diisi",
  }),
  video_id: z.number({
    required_error: "Video wajib diisi",
    invalid_type_error: "Video wajib diisi",
  }),
});

export const getDisplayFields = (textDisplayList, movieList, isEdit) => [
  {
    type: "input",
    name: "id",
    label: "ID",
    placeholder: "ID",
    disabled: true,
  },
  {
    type: "input",
    name: "name",
    label: "Nama Display",
    placeholder: "Nama Display",
  },
  {
    type: "combobox",
    name: "jenis_id",
    label: "Display",
    placeholder: "Pilih",
    disabled: isEdit ? true : false,
    options: optionsJenisDisplay,
  },
  {
    type: "combobox",
    name: "status",
    label: "Status",
    placeholder: "Pilih",
    options: optionsStatusActive,
  },
  {
    type: "combobox",
    name: "video_id",
    label: "Video",
    placeholder: "Pilih",
    options: movieList,
  },
  {
    type: "combobox",
    name: "text_id",
    label: "Text",
    placeholder: "Pilih",
    options: textDisplayList,
  },
];

export const getDisplayTextArea = () => [
  {
    name: "remark",
    label: "Keterangan",
    type: "textarea",
    placeholder: "Keterangan",
    colSpan: "col-span-3",
  },
];
