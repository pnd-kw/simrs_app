import VisualisasiLayout from "../visualisasi/VisualisasiLayout";
import DialogSearchRanapSheet from "./DialogSearchRanapSheet";

export const defaultFormValuesCreateWaitingList = {
  bed_id: "",
  nama_bed: "",
  nama_kamar: "",
  nama_kelas: "",

  id_kunjungan: "",
  tanggal_kunjungan: null,
  date_waiting: null,
  no_rm: "",
  nama_pasien: "",
  nama_kelas_kunjungan: "",
  date_start: null,
  date_estimated_discharge: null,
  is_booking: false,
  remark: "",
};

export const defaultFormValuesUpdateWaitingList = {
  id: "",
  bed_id: "",
  date_estimated_discharge: null,
  remark: "",
};

export const getSheetMonitoringBedFields = () => [
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

export const getSheetMonitoringBedDataKunjunganFields = (setValue, open) => [
  {
    type: "withPopup",
    name: "id_kunjungan",
    label: "ID Kunjungan",
    placeholder: "Cari kunjungan",
    disabled: true,
    setValue,
    open,
    withPopup: {
      title: "Bed",
      component: DialogSearchRanapSheet,
    },
    icon: "mingcute:search-line",
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
    showTodayButton: true,
    disableBeforeToday: true,
    inSheet: true,
  },
  {
    type: "date",
    name: "date_estimated_discharge",
    label: "Rencana Pulang",
    placeholder: "dd/mm/yyyy",
    showTodayButton: true,
    inSheet: true,
  },
  {
    type: "input",
    name: "remark",
    label: "CATATAN",
    placeholder: "CATATAN",
  },
];

export const getSheetMonitoringBedDataKunjunganCheckboxes = () => [
  {
    name: "is_booking",
    label: "booking Bed",
  },
];

export const getUpdateSheetMonitoringBedFields = (setValue, open, close) => [
  {
    type: "withPopup",
    name: "bed_id",
    label: "ID BED",
    placeholder: "ID BED",
    disabled: true,
    setValue,
    open,
    withPopup: {
      title: "Bed",
      component: () => (
        <VisualisasiLayout
          mode="edit"
          onSelectBed={(bed) => {
            setValue("bed_id", bed?.id_bed);
            setValue("nama_bed", bed?.nama_bed || "");
            setValue("nama_kamar", bed?.nama_kamar || "");
            setValue("nama_kelas", bed?.nama_kelas || "");

            close();
          }}
        />
      ),
    },
    icon: "mingcute:search-line",
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

export const getUpdateSheetMonitoringBedDataKunjunganFields = () => [
  {
    type: "input",
    name: "id_kunjungan",
    label: "ID Kunjungan",
    placeholder: "Cari kunjungan",
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
    showTodayButton: true,
    disableBeforeToday: true,
    inSheet: true,
  },
  {
    type: "date",
    name: "date_estimated_discharge",
    label: "Rencana Pulang",
    placeholder: "dd/mm/yyyy",
    showTodayButton: true,
    inSheet: true,
  },
  {
    type: "input",
    name: "remark",
    label: "CATATAN",
    placeholder: "CATATAN",
  },
];
