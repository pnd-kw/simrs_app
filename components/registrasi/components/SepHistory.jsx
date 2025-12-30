import { getSepHistory } from "@/api/registrasi/sep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchQuery } from "@/hooks/fetch/use-fetch-query";
import useNoRujukan from "@/hooks/store/use-no-rujukan";
import useDialog from "@/hooks/ui/use-dialog";
import { useFilterAndPagination } from "@/hooks/utility/use-filter-and-pagination";
import DatePicker from "@/utils/datePicker";
import { SkeletonTable } from "@/utils/skeletonLoader";
import SearchField from "@/utils/table/searchField";
import { Table } from "@/utils/table/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { format, subMonths } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const mappedDataSepHistory = (data) =>
  data?.map((item) => ({
    nama_peserta: item.namaPeserta,
    tgl_sep: item.tglSep,
    poli: item.poli,
    kls_rawat: item.kelasRawat,
    no_kartu: item.noKartu,
    no_rujukan: item.noRujukan,
    no_sep: item.noSep,
    ppk_pelayanan: item.ppkPelayanan,
  }));

const historySEPSchema = z.object({
  no_kartu: z.string().optional(),
  tanggal_awal: z.preprocess(
    (val) => (val instanceof Date ? format(val, "yyyy-MM-dd") : val),
    z.string().optional()
  ),
  tanggal_akhir: z.preprocess(
    (val) => (val instanceof Date ? format(val, "yyyy-MM-dd") : val),
    z.string().optional()
  ),
});

const SepHistory = ({
  insuranceNo,
  formKey,
  setSelectedNoSep = () => {},
  isClose,
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(historySEPSchema),
    defaultValues: {
      no_kartu: insuranceNo,
      tanggal_awal: subMonths(new Date(), 2),
      tanggal_akhir: new Date(),
    },
  });

  const { close } = useDialog();

  const { setNoRujukan } = useNoRujukan(formKey);

  const watchValues = watch();

  const [filters, setFilters] = useState(() => {
    return {
      no_kartu: watchValues.no_kartu,
      tanggal_mulai: watchValues.tanggal_awal
        ? format(watchValues.tanggal_awal, "yyyy-MM-dd")
        : undefined,
      tanggal_selesai: watchValues.tanggal_akhir
        ? format(watchValues.tanggal_akhir, "yyyy-MM-dd")
        : undefined,
    };
  });
  const [searchSepHistory, setSearchSepHistory] = useState("");
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  const onSubmit = (formData) => {
    const formattedFormData = {
      ...formData,
      tanggal_mulai: formData.tanggal_awal
        ? format(formData.tanggal_awal, "yyyy-MM-dd")
        : undefined,
      tanggal_selesai: formData.tanggal_akhir
        ? format(formData?.tanggal_akhir, "yyyy-MM-dd")
        : undefined,
    };
    setFilters(formattedFormData);
  };

  const { data: listSepHistory, isLoading: isLoadingSepHistory } =
    useFetchQuery({
      queryKey: "sep history",
      apiFn: getSepHistory,
      filters: filters,
      mapFn: mappedDataSepHistory,
      enabled: !!filters,
      withPagination: false,
    });

  const { data: filteredAndPaginatedSepHistory, total: totalSepHistory } =
    useFilterAndPagination({
      data: listSepHistory?.items ?? [],
      filterValue: searchSepHistory,
      objKey: ["no_rujukan", "no_sep"],
      paginationObj: pagination,
    });

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full px-6 space-y-4">
        <div className="flex w-full max-h-[10vh] items-center justify-between gap-4">
          <div className="w-full">
            <label htmlFor="no_kartu" className="label-style">
              no bpjs
            </label>
            <Input
              {...register("no_kartu")}
              placeholder="No BPJS"
              className="rounded-sm"
            />
            {errors.no_kartu && (
              <p
                className="pb-1 px-1 text-left text-red-500"
                style={{ fontSize: 10 }}
              >
                {errors.no_kartu.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="tanggal_awal" className="label-style">
              tanggal mulai
            </label>
            <DatePicker
              control={control}
              name="tanggal_awal"
              placeholder="Tanggal"
            />
            {errors.tanggal_awal && (
              <p
                className="pb-1 px-1 text-left text-red-500"
                style={{ fontSize: 10 }}
              >
                {errors.tanggal_awal.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="tanggal_akhir" className="label-style">
              tanggal akhir
            </label>
            <DatePicker
              control={control}
              name="tanggal_akhir"
              placeholder="Tanggal"
            />
            {errors.tanggal_akhir && (
              <p
                className="pb-1 px-1 text-left text-red-500"
                style={{ fontSize: 10 }}
              >
                {errors.tanggal_akhir.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex max-h-[10vh] items-center justify-end py-2">
          <Button variant="primary3" size="sm">
            cari
          </Button>
        </div>
      </form>
      <div className="flex w-full items-center justify-end px-6 py-2">
        <div className="flex w-full">
          <SearchField
            value={searchSepHistory}
            onChange={(val) => setSearchSepHistory(val)}
          />
        </div>
      </div>
      <div className="w-full px-4">
        {isLoadingSepHistory ? (
          <SkeletonTable />
        ) : (
          <Table
            data={filteredAndPaginatedSepHistory}
            sort={false}
            pin={false}
            page={pagination.page - 1}
            totalPage={Math.ceil(
              (listSepHistory?.items?.filter(
                (item) =>
                  item.no_sep
                    ?.toLowerCase()
                    .includes(searchSepHistory.toLowerCase()) ||
                  item.no_rujukan
                    ?.toLowerCase()
                    .includes(searchSepHistory.toLowerCase())
              ).length ?? 0) / pagination.perPage
            )}
            total={totalSepHistory}
            perPage={pagination.perPage}
            border="border-b"
            header={[
              "nama_peserta",
              "tgl_sep",
              "poli",
              "kls_rawat",
              "no_kartu",
              "no_rujukan",
              "no_sep",
              "ppk_pelayanan",
            ]}
            listIconButton={[
              {
                name: "input",
                value: true,
                icon: <Icon icon="token:get" />,
                variant: "gray",
                onClick: (row) => {
                  setNoRujukan(row.no_rujukan);
                  setSelectedNoSep(row.no_sep);
                  isClose ? close() : null;
                },
              },
            ]}
            customWidths={{
              tgl_sep: "min-w-[10rem]",
              no_rujukan: "min-w-[12rem]",
              no_sep: "min-w-[12rem]",
              poli_rujukan: "min-w-[10rem]",
            }}
            tableHeadTextSize="text-xs"
            onPageChange={(page) =>
              setPagination((prev) => ({
                ...prev,
                page: page + 1,
              }))
            }
            onRowsPerPageChange={(perPage) =>
              setPagination((prev) => ({
                ...prev,
                perPage,
                page: 1,
              }))
            }
          />
        )}
      </div>
    </div>
  );
};

export default SepHistory;
