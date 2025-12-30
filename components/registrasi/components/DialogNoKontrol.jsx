import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePicker from "@/utils/datePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { FILTER_NO_KONTROL } from "../ConstantsValue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { useFetchQuery } from "@/hooks/fetch/use-fetch-query";
import {
  deleteNoKontrol,
  getListNoKontrol,
  getNoKontrol,
} from "@/api/registrasi/noKontrol";
import { SkeletonTable } from "@/utils/skeletonLoader";
import { Table } from "@/utils/table/table";
import CreateNoRencanaKontrol from "./CreateNoRencanaKontrol";
import useDeleteTarget from "@/hooks/store/use-delete-target";
import DialogDelete from "@/components/DialogDelete";
import { useDelete } from "@/hooks/mutation/use-delete";
import useDialog from "@/hooks/ui/use-dialog";
import SearchField from "@/utils/table/searchField";
import { useFilterAndPagination } from "@/hooks/utility/use-filter-and-pagination";
import useNoKontrol from "@/hooks/store/use-no-kontrol";

const mappedData = (data) =>
  data.map((item) => ({
    no_kontrol: item.noSuratKontrol,
    tgl_kontrol: item.tglRencanaKontrol,
    jenis: item.jnsPelayanan,
    nama: item.nama,
    doctor_id: item.kodeDokter,
    dokter: item.namaDokter,
    poli_asal: item.namaPoliAsal,
    poli_tujuan: item.namaPoliTujuan,
    no_kartu: item.noKartu,
    no_sep_asal: item.noSepAsalKontrol,
    tgl_sep: item.tglSEP,
    tgl_terbit: item.tglTerbitKontrol,
  }));

const noKontrolSchema = z.object({
  no_kartu: z
    .string()
    .min(13, "Harap Input NO ASURANSI/BPJS Pada Form Kunjungan!"),
  tanggal: z.date().optional(),
  filter: z.string().optional(),
});

const DialogNoKontrol = ({ insuranceNo, formKey, isDialogOpen }) => {
  const formRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState("no kontrol");

  const { setNoKontrol } = useNoKontrol(formKey);

  const formSearchNoKontrol = useForm({
    resolver: zodResolver(noKontrolSchema),
    defaultValues: { no_kartu: insuranceNo, tanggal: new Date(), filter: "2" },
  });

  const formSearchDaftarNoKontrol = useForm({
    defaultValues: { from: new Date(), to: new Date(), filter: "2" },
  });

  const { open, close } = useDialog();
  const { getTargetId, setId } = useDeleteTarget();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dataCreateNoKontrol, setDataCreateNoKontrol] = useState({});
  const watchValuesNoKontrol = formSearchNoKontrol.watch();
  const watchValuesDaftarNoKontrol = formSearchDaftarNoKontrol.watch();
  const [noKontrolFilters, setNoKontrolFilters] = useState(() => {
    const bulan = format(watchValuesNoKontrol.tanggal, "MM");
    const tahun = format(watchValuesNoKontrol.tanggal, "yyyy");
    return {
      bulan,
      tahun,
      no_kartu: watchValuesNoKontrol.no_kartu,
      filter: watchValuesNoKontrol.filter,
    };
  });
  const [daftarNoKontrolFilters, setDaftarNoKontrolFilters] = useState(() => {
    return {
      tanggal_mulai: watchValuesDaftarNoKontrol.from
        ? format(watchValuesDaftarNoKontrol.from, "yyyy-MM-dd")
        : "",
      tanggal_selesai: watchValuesDaftarNoKontrol.to
        ? format(watchValuesDaftarNoKontrol.to, "yyyy-MM-dd")
        : "",
      filter: watchValuesDaftarNoKontrol.filter,
    };
  });

  const [searchNoKontrol, setSearchNoKontrol] = useState("");
  const [searchDaftarNoKontrol, setSearchDaftarNoKontrol] = useState("");

  const [pagination, setPagination] = useState({
    noKontrol: { page: 1, perPage: 10 },
    daftarNoKontrol: { page: 1, perPage: 10 },
  });

  const [
    isResetCreateNoRencanaKontrolForm,
    setIsResetCreateNoRencanaKontrolForm,
  ] = useState(false);

  const { data: noKontrol, isLoading: isLoadingNoKontrol } = useFetchQuery({
    queryKey: "no kontrol",
    apiFn: getNoKontrol,
    filters: noKontrolFilters,
    mapFn: mappedData,
    enabled: !!noKontrolFilters,
    withPagination: false,
  });

  const { data: daftarNoKontrol, isLoading: isLoadingDaftarNoKontrol } =
    useFetchQuery({
      queryKey: "daftar no kontrol",
      apiFn: getListNoKontrol,
      filters: daftarNoKontrolFilters,
      mapFn: mappedData,
      enabled: !!daftarNoKontrolFilters,
      withPagination: false,
    });

  const { data: filteredAndPaginatedNoKontrol, total: totalNoKontrol } =
    useFilterAndPagination({
      data: noKontrol?.items ?? [],
      filterValue: searchNoKontrol,
      objKey: ["no_kontrol", "no_kartu"],
      paginationObj: pagination.noKontrol,
    });

  const {
    data: filteredAndPaginatedDaftarNoKontrol,
    total: totalDaftarNoKontrol,
  } = useFilterAndPagination({
    data: daftarNoKontrol?.items ?? [],
    filterValue: searchDaftarNoKontrol,
    objKey: ["no_kontrol", "no_kartu"],
    paginationObj: pagination.daftarNoKontrol,
  });

  const { mutate } = useDelete({
    queryKey: "no kontrol",
    apiFn: deleteNoKontrol,
  });

  useEffect(() => {
    if (isResetCreateNoRencanaKontrolForm) {
      setIsExpanded(false);
      setDataCreateNoKontrol({});

      const timer = setTimeout(() => {
        setIsResetCreateNoRencanaKontrolForm(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isResetCreateNoRencanaKontrolForm]);

  useEffect(() => {
    if (searchNoKontrol && searchNoKontrol !== "") {
    }
  });

  const onSubmitNoKontrol = async (formData) => {
    const bulan = format(formData.tanggal, "MM");
    const tahun = format(formData.tanggal, "yyyy");

    const queryObj = {
      bulan: bulan,
      tahun: tahun,
      no_kartu: formData.no_kartu,
      filter: formData.filter,
    };

    setNoKontrolFilters(queryObj);
    setPagination((prev) => ({
      ...prev,
      noKontrol: { page: 1, perPage: 10 },
    }));
  };

  const onSubmitDaftarNoKontrol = async (formData) => {
    const queryObj = {
      tanggal_mulai: formData.from ? format(formData.from, "yyyy-MM-dd") : "",
      tanggal_selesai: formData.to ? format(formData.to, "yyyy-MM-dd") : "",
      filter: formData.filter,
    };

    setDaftarNoKontrolFilters(queryObj);
    setPagination((prev) => ({
      ...prev,
      daftarNoKontrol: { page: 1, perPage: 10 },
    }));
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
    <div className="flex flex-col w-full h-full items-center justify-center p-2 overflow-auto">
      <div className="flex w-full min-h-[8vh] items-center mb-4">
        <div className="flex w-1/2">
          <Button
            variant={
              selectedTab === "no kontrol"
                ? "primaryGradient"
                : "outlinedGreen1"
            }
            className="flex w-full h-[8vh] rounded-tl-md rounded-bl-md uppercase"
            onClick={() => {
              setSelectedTab("no kontrol");
              setIsResetCreateNoRencanaKontrolForm(true);
            }}
          >
            no kontrol
          </Button>
          <Button
            variant={
              selectedTab === "daftar semua no kontrol"
                ? "primaryGradient"
                : "outlinedGreen1"
            }
            className="flex w-full h-[8vh] rounded-tr-md rounded-br-md uppercase"
            onClick={() => {
              setSelectedTab("daftar semua no kontrol");
              setIsResetCreateNoRencanaKontrolForm(true);
            }}
          >
            daftar semua no kontrol
          </Button>
        </div>
      </div>
      <div
        ref={formRef}
        className="flex flex-col w-full border border-stone-500 rounded-md mb-10 p-2"
      >
        <div>
          <Button
            type="button"
            variant="transparent"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon
              icon="dashicons:arrow-right"
              className={`size-8 text-stone-900 hover:text-stone-400 transition-transform duration-500 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
            Buat Nomor Rencana Kontrol
          </Button>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-[100vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex w-full p-2">
            <CreateNoRencanaKontrol
              insuranceNo={insuranceNo}
              editData={dataCreateNoKontrol}
              isReset={isResetCreateNoRencanaKontrolForm}
            />
          </div>
        </div>
      </div>
      {selectedTab === "no kontrol" && (
        <>
          <div className="flex w-full min-h-[10vh] overflow-auto p-2">
            <form
              onSubmit={formSearchNoKontrol.handleSubmit(onSubmitNoKontrol)}
              className="w-full"
            >
              <div className="grid grid-cols-3 items-center justify-center gap-4">
                <div className="flex flex-col flex-1">
                  <div>
                    <label
                      htmlFor="no_kartu"
                      className="label-style"
                      style={{ fontSize: 9 }}
                    >
                      no kartu
                    </label>
                  </div>
                  <Input
                    {...formSearchNoKontrol.register("no_kartu")}
                    className="rounded-sm"
                    disabled={true}
                  />
                  {formSearchNoKontrol.formState.errors.no_kartu && (
                    <p
                      className="pt-1 px-1 text-left text-red-500"
                      style={{ fontSize: 9 }}
                    >
                      {formSearchNoKontrol.formState.errors.no_kartu.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex w-full items-center justify-between">
                    <label
                      htmlFor="tanggal"
                      className="label-style"
                      style={{ fontSize: 9 }}
                    >
                      tanggal
                    </label>
                    <Button
                      type="button"
                      variant="text"
                      size="text"
                      onClick={() => setValue("date", new Date())}
                      style={{ fontSize: 9 }}
                    >
                      Today
                    </Button>
                  </div>
                  <DatePicker
                    name="tanggal"
                    control={formSearchNoKontrol.control}
                    placeholder="mm / yyyy"
                    showTime={false}
                    withoutDate={true}
                    triggerByIcon={false}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div>
                    <label
                      htmlFor=""
                      className="label-style"
                      style={{ fontSize: 9 }}
                    >
                      filter
                    </label>
                  </div>
                  <Controller
                    name="filter"
                    control={formSearchNoKontrol.control}
                    render={({ field }) => {
                      const selected = FILTER_NO_KONTROL.find(
                        (item) => item.value === field.value
                      );
                      return (
                        <div className="relative flex items-center">
                          <Select
                            value={field.value || ""}
                            onValueChange={(val) => field.onChange(val)}
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
                              <SelectValue placeholder="Pilih Filter">
                                {selected?.key ?? "Pilih Filter"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {FILTER_NO_KONTROL.map((item) => {
                                  return (
                                    <SelectItem
                                      key={item.key}
                                      value={item.value}
                                    >
                                      {item.key}
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
              <div className="flex w-full min-h-[6vh] justify-end pr-2 py-2">
                <Button
                  type="submit"
                  variant="outlined"
                  className="capitalize text-stone-500"
                >
                  <Icon icon="mingcute:search-line" /> cari
                </Button>
              </div>
            </form>
          </div>
          <div className="w-full px-2">
            <SearchField
              value={searchNoKontrol}
              onChange={(val) => setSearchNoKontrol(val)}
            />
          </div>
          <div className="w-full px-4">
            {isLoadingNoKontrol ? (
              <SkeletonTable />
            ) : (
              <Table
                data={filteredAndPaginatedNoKontrol}
                sort={false}
                pin={false}
                page={pagination.noKontrol.page - 1}
                totalPage={Math.ceil(
                  (noKontrol?.items?.filter(
                    (item) =>
                      item.no_kontrol
                        ?.toLowerCase()
                        .includes(searchNoKontrol.toLowerCase()) ||
                      item.no_kartu
                        ?.toLowerCase()
                        .includes(searchNoKontrol.toLowerCase())
                  ).length ?? 0) / pagination.noKontrol.perPage
                )}
                perPage={pagination.noKontrol.perPage}
                total={totalNoKontrol}
                border="border-b"
                listIconButton={[
                  {
                    name: "edit",
                    value: true,
                    icon: <Icon icon="ic:round-edit" />,
                    variant: "yellow2",
                    onClick: (row) => {
                      setIsExpanded(true);
                      setDataCreateNoKontrol({
                        noSuratKontrol: row.no_kontrol,
                        kodeDokter: row.doctor_id,
                        poliTujuan: row.poli_tujuan,
                      });
                      setTimeout(() => {
                        formRef.current.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 200);
                    },
                  },
                  {
                    name: "input",
                    value: true,
                    icon: <Icon icon="token:get" />,
                    variant: "primary1",
                    onClick: (row) => {
                      setNoKontrol(row.no_kontrol);
                      isDialogOpen(false);
                    },
                  },
                  {
                    name: "delete",
                    value: true,
                    icon: <Icon icon="mdi:trash" />,
                    variant: "red1",
                    onClick: (row) => {
                      setId(row.no_kontrol);
                      open({
                        minWidth: "min-w-[30vw]",
                        contentTitle: "Hapus Record",
                        headerColor: "bg-red1",
                        component: DialogDelete,
                        props: {
                          dialogImage: "/assets/exclamation-red-icon.svg",
                          data: {
                            prop1: row.no_kontrol,
                            prop2: row.nama,
                          },
                          prop1: "NO KONTROL",
                          prop2: "NAMA",
                          onDelete: handleDelete,
                        },
                      });
                    },
                  },
                ]}
                header={[
                  "no_kontrol",
                  "tgl_kontrol",
                  "jenis",
                  "nama",
                  "dokter",
                  "poli_asal",
                  "poli_tujuan",
                  "no_kartu",
                  "no_sep_asal",
                  "tgl_sep",
                  "tgl_terbit",
                ]}
                customWidths={{
                  no_kontrol: "min-w-[11rem]",
                  tgl_kontrol: "min-w-[10rem]",
                  jenis: "min-w-[8rem]",
                  nama: "min-w-[8rem]",
                  dokter: "min-w-[9rem]",
                  poli_asal: "min-w-[9rem]",
                  poli_tujuan: "min-w-[10rem]",
                  no_kartu: "min-w-[9rem]",
                  no_sep_asal: "min-w-[11rem]",
                  tgl_sep: "min-w-[8rem]",
                  tgl_terbit: "min-w-[8rem]",
                }}
                hiddenColumns={["doctor_id"]}
                onPageChange={(page) =>
                  setPagination((prev) => ({
                    ...prev,
                    noKontrol: { ...prev.noKontrol, page: page + 1 },
                  }))
                }
                onRowsPerPageChange={(perPage) =>
                  setPagination((prev) => ({
                    ...prev,
                    noKontrol: { ...prev.noKontrol, perPage, page: 1 },
                  }))
                }
              />
            )}
          </div>
        </>
      )}
      {selectedTab === "daftar semua no kontrol" && (
        <>
          <div className="flex w-full min-h-[10vh] overflow-auto p-2">
            <form
              onSubmit={formSearchDaftarNoKontrol.handleSubmit(
                onSubmitDaftarNoKontrol
              )}
              className="w-full"
            >
              <div className="grid grid-cols-3 items-center justify-center gap-4">
                <div className="flex flex-col flex-1">
                  <div>
                    <label
                      htmlFor="from"
                      className="label-style"
                      style={{ fontSize: 9 }}
                    >
                      tanggal mulai
                    </label>
                    <DatePicker
                      name="from"
                      control={formSearchDaftarNoKontrol.control}
                      placeholder="dd/ mm / yyyy"
                      showTime={false}
                      triggerByIcon={true}
                      minDays={10}
                    />
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <div>
                    <label
                      htmlFor="to"
                      className="label-style"
                      style={{ fontSize: 9 }}
                    >
                      tanggal selesai
                    </label>
                    <DatePicker
                      name="to"
                      control={formSearchDaftarNoKontrol.control}
                      placeholder="dd/ mm / yyyy"
                      showTime={false}
                      triggerByIcon={true}
                    />
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <div>
                    <label
                      htmlFor=""
                      className="label-style"
                      style={{ fontSize: 9 }}
                    >
                      filter
                    </label>
                  </div>
                  <Controller
                    name="filter"
                    control={formSearchDaftarNoKontrol.control}
                    render={({ field }) => {
                      const selected = FILTER_NO_KONTROL.find(
                        (item) => item.value === field.value
                      );
                      return (
                        <div className="relative flex items-center">
                          <Select
                            value={field.value || ""}
                            onValueChange={(val) => field.onChange(val)}
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
                              <SelectValue placeholder="Pilih Filter">
                                {selected?.key ?? "Pilih Filter"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {FILTER_NO_KONTROL.map((item) => {
                                  return (
                                    <SelectItem
                                      key={item.key}
                                      value={item.value}
                                    >
                                      {item.key}
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
              <div className="flex w-full min-h-[6vh] justify-end pr-2 py-2">
                <Button
                  type="submit"
                  variant="outlined"
                  className="capitalize text-stone-500"
                >
                  <Icon icon="mingcute:search-line" /> cari
                </Button>
              </div>
            </form>
          </div>
          <div className="w-full px-2">
            <SearchField
              value={searchDaftarNoKontrol}
              onChange={(val) => setSearchDaftarNoKontrol(val)}
            />
          </div>
          <div className="w-full px-4">
            {isLoadingDaftarNoKontrol ? (
              <SkeletonTable />
            ) : (
              <Table
                data={filteredAndPaginatedDaftarNoKontrol}
                sort={false}
                pin={false}
                page={pagination.daftarNoKontrol.page - 1}
                totalPage={Math.ceil(
                  (daftarNoKontrol?.items?.filter(
                    (item) =>
                      item.no_kontrol
                        ?.toLowerCase()
                        .includes(searchDaftarNoKontrol.toLowerCase()) ||
                      item.no_kartu
                        ?.toLowerCase()
                        .includes(searchDaftarNoKontrol.toLowerCase())
                  ).length ?? 0) / pagination.daftarNoKontrol.perPage
                )}
                perPage={pagination.daftarNoKontrol.perPage}
                total={totalDaftarNoKontrol}
                border="border-b"
                listIconButton={[
                  {
                    name: "edit",
                    value: true,
                    icon: <Icon icon="ic:round-edit" />,
                    variant: "yellow2",
                    onClick: (row) => {
                      setIsExpanded(true);
                      setDataCreateNoKontrol({
                        noSuratKontrol: row.no_kontrol,
                        kodeDokter: row.doctor_id,
                        poliTujuan: row.poli_tujuan,
                      });
                      setTimeout(() => {
                        formRef.current.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }, 200);
                    },
                  },
                  {
                    name: "input",
                    value: true,
                    icon: <Icon icon="token:get" />,
                    variant: "primary1",
                    onClick: (row) => {
                      setNoKontrol(row.no_kontrol);
                      isDialogOpen(false);
                    },
                  },
                  {
                    name: "delete",
                    value: true,
                    icon: <Icon icon="mdi:trash" />,
                    variant: "red1",
                    onClick: (row) => {
                      setId(row.no_kontrol);
                      open({
                        minWidth: "min-w-[30vw]",
                        contentTitle: "Hapus Record",
                        headerColor: "bg-red1",
                        component: DialogDelete,
                        props: {
                          dialogImage: "/assets/exclamation-red-icon.svg",
                          data: {
                            prop1: row.no_kontrol,
                            prop2: row.nama,
                          },
                          prop1: "NO KONTROL",
                          prop2: "NAMA",
                          onDelete: handleDelete,
                        },
                      });
                    },
                  },
                ]}
                header={[
                  "no_kontrol",
                  "tgl_kontrol",
                  "jenis",
                  "nama",
                  "dokter",
                  "poli_asal",
                  "poli_tujuan",
                  "no_kartu",
                  "no_sep_asal",
                  "tgl_sep",
                  "tgl_terbit",
                ]}
                customWidths={{
                  no_kontrol: "min-w-[11rem]",
                  tgl_kontrol: "min-w-[10rem]",
                  jenis: "min-w-[8rem]",
                  nama: "min-w-[8rem]",
                  dokter: "min-w-[9rem]",
                  poli_asal: "min-w-[9rem]",
                  poli_tujuan: "min-w-[10rem]",
                  no_kartu: "min-w-[9rem]",
                  no_sep_asal: "min-w-[11rem]",
                  tgl_sep: "min-w-[8rem]",
                  tgl_terbit: "min-w-[8rem]",
                }}
                hiddenColumns={["doctor_id"]}
                onPageChange={(page) =>
                  setPagination((prev) => ({
                    ...prev,
                    daftarNoKontrol: {
                      ...prev.daftarNoKontrol,
                      page: page + 1,
                    },
                  }))
                }
                onRowsPerPageChange={(perPage) =>
                  setPagination((prev) => ({
                    ...prev,
                    daftarNoKontrol: {
                      ...prev.daftarNoKontrol,
                      perPage,
                      page: 1,
                    },
                  }))
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DialogNoKontrol;
