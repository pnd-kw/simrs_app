import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { Table } from "@/utils/table/table";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import DatePicker from "@/utils/datePicker";
import { Button } from "@/components/ui/button";
import useScrollTopStore from "@/stores/useScrollTopStore";
import { SkeletonTable } from "@/utils/skeletonLoader";
import {
  deleteRajal,
} from "@/api/registrasi/rajal";
import { format } from "date-fns";
import useDialog from "@/hooks/ui/use-dialog";
import DialogDelete from "@/components/DialogDelete";
import useDeleteTarget from "@/hooks/store/use-delete-target";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import useRajalRs from "@/hooks/kunjungan_rawat_jalan/use-rajal-rs";
import useDoctor from "@/hooks/booking_antrian_kunjungan/use-doctor";
import useDataAntrian from "@/hooks/kunjungan_rawat_jalan/use-data-antrian";
import { useFetchQuery } from "@/hooks/fetch/use-fetch-query";
import { useDelete } from "@/hooks/mutation/use-delete";
import { useFetchPoliklinik } from "@/hooks/fetch/master_data/use-fetch-poliklinik";
import { useFetchDoctor } from "@/hooks/fetch/master_data/use-fetch-doctor";
import { getRawatInap } from "@/api/registrasi/ranap";

const columnPencarian = [
  { key: "Semua", value: "all" },
  { key: "ID RM", value: "no_rm" },
  { key: "ID Kunjungan", value: "kunjungan_id" },
  { key: "Nama", value: "nama_pasien" },
  { key: "ID Tagihan", value: "tagihan_id" },
  { key: "No Asuransi", value: "insurance_no" },
  { key: "No SEP", value: "no_sep" },
  { key: "Created By", value: "createdName" },
];

const typeRM = [
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

const status = [
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

const batal = [
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

const mappedData = (data) =>
  data.map((item) => ({
    id_kunjungan: item.id,
    id_rm: item.patients_id,
    nik: item.nik,
    nama_rm: item.rm_name,
    id_tagihan: item.tagihan_id,
    tanggal_registrasi: item.date,
    status: (
      <span
        className={`block w-full p-2 ${
          item.iscancel ? "bg-red1" : item.status ? "bg-grey1" : "bg-primary3"
        } rounded-md text-white text-center uppercase`}
      >
        {item.iscancel ? "dibatalkan" : item.status ? "tidak aktif" : "aktif"}
      </span>
    ),
    status_kunjungan: item.status,
    no_hp: item.nohp,
    no_tlp: item.rm_phone_number,
    dokter: item.doctor_fullname,
    perusahaan: item.company_name,
    asuransi: item.insurance_name,
    no_asuransi: item.insurance_no,
    no_sep: item.no_sep,
    initial: item.initial,
    tanggal_lahir: item.rm_date_ob,
    umur: item.umur,
    jenis_kelamin: item.rm_gender === 1 ? "Laki-laki" : "Perempuan",
    telepon: item.rm_phone_number,
    alamat: item.rm_address_now,
    company_id: item.company_id,
    insurance_id: item.insurance_id,
    insurance_no: item.insurance_no,
    norujukan: item.norujukan,
    nokontrol: item.nokontrol,
    jenis_kunjungan: item.jenis_kunjungan,
    cara_masuk: item.cara_masuk,
    doctor_kodebridge: item.doctor_kodebridge,
    poliklinik_id: item.doctor_poliklinik_id,
    doctor_id: item.doctor_id,
    schedule_doctor_id: item.schedule_doctor_id,
    ppk_perujuk: item.nama_ppk_perujuk,
    hak_kelas: item.nama_hak_kelas,
    catatan: item.remark,
    inserted_time: item.createdAt,
    inserted_by: item.createdName,
    updated_time: item.updatedAt,
    updated_by: item.updatedName,
  }));

const SearchKunjunganRanap = ({ setIdKunjungan }) => {
  const { register, control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      search_column: "all", // Untuk menyesuaikan endpoint search menggunakan search_text[] dan search_column[]
      type_rm: "all",
      status: "all",
      batal: "all",
    },
  });

  const { open, close } = useDialog();
  const { getTargetId, setId } = useDeleteTarget();
  const [filters, setFilters] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFetchQuery({
    queryKey: "kunjungan ranap",
    apiFn: getRawatInap,
    filters,
    page,
    perPage: rowsPerPage,
    mapFn: mappedData,
  });
  const { mutate } = useDelete({
    queryKey: "kunjungan ranap",
    apiFn: deleteRajal,
  });
  const { setRajalRsData } = useRajalRs();
  const { setRajalDoctor } = useDoctor();
  const { setDataAntrian } = useDataAntrian();
  const { data: poliklinik } = useFetchPoliklinik();
  const { data: dokterList } = useFetchDoctor();
  const category = useWatch({ control, name: "search_column" });
  const scrollToTop = useScrollTopStore((state) => state.scrollToTop);

  const onSubmit = async (formData) => {
    const {
      search_column,
      search_text,
      poli,
      doctor_id,
      from,
      to,
      type_rm,
      status,
      iscancel,
    } = formData;

    const queryObj = {
      search_column,
      search_text,
      poli,
      doctor_id,
      type_rm,
      status,
      iscancel,
      tanggal_mulai: from ? format(from, "yyyy-MM-dd") : "",
      tanggal_selesai: to ? format(to, "yyyy-MM-dd") : "",
    };

    setFilters(queryObj);
    setPage(1);
  };

  const handleDelete = async () => {
    const id = getTargetId();
    if (!id) {
      toastWithProgress({
        title: "Gagal",
        description: "Gagal mendapatkan target id.",
        duration: 3000,
        type: "error",
      });
      return;
    }

    mutate(id, {
      onSuccess: () => close(),
    });
  };

  return (
    <div className="w-full h-full px-4 py-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div
          className={`flex flex-col w-full min-h-[16vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm`}
        >
          <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
            cari pasien
          </div>
          <div className="grid grid-cols-4 gap-2 px-2">
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="search_column" className="label-style">
                    kategori
                  </label>
                </div>
                <div className="relative w-2/3">
                  <Controller
                    name="search_column"
                    control={control}
                    render={({ field }) => (
                      <div className="relative flex items-center">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className="w-full"
                            style={{ fontSize: 12 }}
                            icon={
                              <Icon
                                icon="dashicons:arrow-down"
                                className="size-5 text-stone-900 hover:text-stone-400"
                              />
                            }
                          >
                            <SelectValue placeholder="Kategori Pencarian" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {columnPencarian.map((item) => (
                                <SelectItem key={item.key} value={item.value}>
                                  {item.key}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="search_text" className="label-style">
                    kata kunci
                  </label>
                </div>
                <div className="relative w-2/3">
                  <Input
                    {...register("search_text")}
                    placeholder="Kata Kunci Sesuai Kategori"
                    disabled={category === "Semua"}
                    className="rounded-sm"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant="text"
                  size="text"
                  onClick={() => setValue("from", new Date())}
                  style={{ fontSize: 9 }}
                >
                  Today
                </Button>
              </div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="from" className="label-style">
                    tgl awal
                  </label>
                </div>
                <div className="relative w-2/3">
                  <DatePicker
                    control={control}
                    name="from"
                    placeholder="dd/mm/yyyy HH:mm"
                    triggerByIcon={true}
                    showTime={true}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant="text"
                  size="text"
                  onClick={() => setValue("to", new Date())}
                  style={{ fontSize: 9 }}
                >
                  Today
                </Button>
              </div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="to" className="label-style">
                    tgl akhir
                  </label>
                </div>
                <div className="relative w-2/3">
                  <DatePicker
                    control={control}
                    name="to"
                    placeholder="dd/mm/yyyy HH:mm"
                    triggerByIcon={true}
                    showTime={true}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="doctor_id" className="label-style">
                    dokter
                  </label>
                </div>
                <div className="relative w-2/3">
                  <Controller
                    name="doctor_id"
                    control={control}
                    render={({ field }) => {
                      const selected = dokterList?.find(
                        (item) => item.id === field.value
                      );
                      return (
                        <div className="relative flex items-center">
                          <Select
                            value={field.value?.toString() || ""}
                            onValueChange={(val) => field.onChange(Number(val))}
                          >
                            <SelectTrigger
                              className="w-full"
                              style={{ fontSize: 12 }}
                              icon={
                                <Icon
                                  icon="dashicons:arrow-down"
                                  className="size-5 text-stone-900 hover:text-stone-400"
                                />
                              }
                            >
                              <SelectValue placeholder="Pilih Dokter">
                                <span className="max-w-50">
                                  {selected?.name ?? "Pilih Dokter"}
                                </span>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {dokterList?.map((item) => {
                                  return (
                                    <SelectItem
                                      key={item.id}
                                      value={item.id.toString()}
                                    >
                                      {item.name}
                                    </SelectItem>
                                  );
                                })}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="type_rm" className="label-style">
                    type rm
                  </label>
                </div>
                <div className="relative w-2/3">
                  <Controller
                    name="type_rm"
                    control={control}
                    render={({ field }) => (
                      <div className="relative flex items-center">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className="w-full"
                            style={{ fontSize: 12 }}
                            icon={
                              <Icon
                                icon="dashicons:arrow-down"
                                className="size-5 text-stone-900 hover:text-stone-400"
                              />
                            }
                          >
                            <SelectValue placeholder="Type RM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {typeRM.map((item) => (
                                <SelectItem key={item.key} value={item.value}>
                                  {item.key}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="status" className="label-style">
                    status
                  </label>
                </div>
                <div className="relative w-2/3">
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <div className="relative flex items-center">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className="w-full"
                            style={{ fontSize: 12 }}
                            icon={
                              <Icon
                                icon="dashicons:arrow-down"
                                className="size-5 text-stone-900 hover:text-stone-400"
                              />
                            }
                          >
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {status.map((item) => (
                                <SelectItem key={item.key} value={item.value}>
                                  {item.key}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="iscancel" className="label-style">
                    Batal
                  </label>
                </div>
                <div className="relative w-2/3">
                  <Controller
                    name="iscancel"
                    control={control}
                    render={({ field }) => (
                      <div className="relative flex items-center">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            className="w-full"
                            style={{ fontSize: 12 }}
                            icon={
                              <Icon
                                icon="dashicons:arrow-down"
                                className="size-5 text-stone-900 hover:text-stone-400"
                              />
                            }
                          >
                            <SelectValue placeholder="Batal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {batal.map((item) => (
                                <SelectItem key={item.key} value={item.value}>
                                  {item.key}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-end min-h-[6vh] px-2">
            <Button
              type="button"
              variant="red1"
              className="border-2 border-red2"
              size="sm"
              onClick={() => {
                reset();
              }}
            >
              <Icon icon="fluent:arrow-sync-12-filled" />
              reset
            </Button>
          </div>
        </div>

        <div className="flex w-full md:max-h-[10vh] items-center py-4">
          <div className="flex w-full gap-4 justify-end">
            <Button variant="lightBlue" className="capitalize">
              export list
            </Button>
            <Button variant="yellow1" className="text-stone-900">
              export
            </Button>
            <Button
              type="submit"
              variant="outlinedGreen2"
              className="capitalize"
            >
              <span>Search</span>
              <Icon icon="mingcute:search-line" />
            </Button>
          </div>
        </div>
      </form>
      <div className="w-full min-h-[90vh]">
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <Table
            data={data?.items ?? []}
            page={page - 1}
            totalPage={data ? data.meta.last_page : 1}
            perPage={rowsPerPage}
            total={data ? data.meta.total : 0}
            defaultPinned={{ column: "id_booking", position: "left" }}
            border="border"
            listIconButton={[
              {
                name: "edit",
                value: true,
                icon: <Icon icon="ic:round-edit" />,
                variant: "yellow2",
                onClick: (row) => {
                  setRajalRsData(row);
                  setRajalDoctor(row.doctor_id);
                  scrollToTop();
                },
              },
              {
                name: "delete",
                value: true,
                icon: <Icon icon="mdi:trash" />,
                variant: "red1",
                onClick: (row) => {
                  setId(row.id_kunjungan);
                  open({
                    minWidth: "min-w-[30vw]",
                    contentTitle: "Hapus Record",
                    headerColor: "bg-red1",
                    component: DialogDelete,
                    props: {
                      dialogImage: "/assets/exclamation-red-icon.svg",
                      data: {
                        prop1: row.id_kunjungan,
                        prop2: row.nama_rm,
                      },
                      prop1: "ID KUNJUNGAN",
                      prop2: "NAMA RM",
                      onDelete: handleDelete,
                    },
                  });
                },
              },
            ]}
            customWidths={{
              id_kunjungan: "min-w-[12rem]",
              id_rm: "min-w-[8rem]",
              nama_rm: "min-w-[12rem]",
              id_tagihan: "min-w-[10rem]",
              tanggal_registrasi: "min-w-[14rem]",
              status: "min-w-[8rem]",
              no_hp: "min-w-[8rem]",
              no_tlp: "min-w-[8rem]",
              dokter: "min-w-[12rem]",
              perusahaan: "min-w-[10rem]",
              asuransi: "min-w-[9rem]",
              no_asuransi: "min-w-[10rem]",
              no_sep: "min-w-[8rem]",
              no_antrian: "min-w-[10rem]",
              tanggal_lahir: "min-w-[11rem]",
              umur: "min-w-[8rem]",
              ppk_perujuk: "min-w-[10rem]",
              hak_kelas: "min-w-[9rem]",
              catatan_batal: "min-w-[14rem]",
              catatan: "min-w-[14rem]",
              inserted_time: "min-w-[11rem]",
              inserted_by: "min-w-[11rem]",
              updated_time: "min-w-[11rem]",
              updated_by: "min-w-[11rem]",
            }}
            hiddenColumns={[
              "nik",
              "jenis_kelamin",
              "telepon",
              "alamat",
              "pekerjaan",
              "status_kunjungan",
              "company_id",
              "insurance_id",
              "insurance_no",
              "norujukan",
              "nokontrol",
              "jenis_kunjungan",
              "cara_masuk",
              "poli_layanan",
              "doctor_kodebridge",
              "poliklinik_id",
              "doctor_id",
              "schedule_doctor_id",
              "initial",
            ]}
            onPageChange={(newPage) => setPage(newPage + 1)}
            onRowsPerPageChange={(newPerPage) => {
              setRowsPerPage(newPerPage);
              setPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SearchKunjunganRanap;
