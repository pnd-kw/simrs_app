import DynamicFormFields from "@/components/DynamicFormView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useBedEditStore,
  useMonitoringBedStore,
} from "@/stores/management/bed/useBedManagementStore";
import {
  useKamarStore,
  useListBedStore,
  useRuangListStore
} from "@/stores/master/useMasterStore";
import useScrollTopStore from "@/stores/useScrollTopStore";
import { buildQueryString } from "@/utils/buildQueryString";
import { SkeletonTable } from "@/utils/skeletonLoader";
import { Table } from "@/utils/table/table";
import { formatDate } from "@/utils/tanggal/formatDate";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  getSearchMonitoringBedFields,
  getSearchMonitoringBedFieldsTwo,
} from "./SearchMonitoringBedFields";

const SearchMonitoringBed = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      id_kunjungan: "",
      nama_rm: "",
      no_rm: "",
      tanggal_rencana_pulang: null,
      alamat: "",
      status_waiting: null,
      kondisi_bed: null,
      bed: null,
      kamar: null,
      ruang: null,
    },
  });
  const ruangId = useWatch({ control, name: "ruang" });
  const scrollToTop = useScrollTopStore((state) => state.scrollToTop);
  const { listBed } = useListBedStore();
  const { ruangList } = useRuangListStore();
  const { fetchKamar, kamar } = useKamarStore();

  const {
    dataMonitoringBed,
    fetchMonitoringBed,
    pagination,
    rowsPerPage,
    isLoading,
    setRowsPerPage,
    setPage,
  } = useMonitoringBedStore();

  const formattedData = dataMonitoringBed.map((item) => ({
    kondisi_bed: (
      <Badge
        className={`
      w-full p-2 text-center uppercase text-white rounded-md
      ${item.kondisi_bed === 1 ? "bg-[#F09F00]" : ""}
      ${item.kondisi_bed === 2 ? "bg-[#296218]" : ""}
      ${item.kondisi_bed === 3 ? "bg-[#CC2B1D]" : ""}
    `}
      >
        {item.kondisi_bed === 1 && "Belum Siap"}
        {item.kondisi_bed === 2 && "Siap"}
        {item.kondisi_bed === 3 && "Terpakai"}
      </Badge>
    ),
    bed: item.name,
    kamar: item.kamar_name,
    waiting: item.jumlah_waiting ? `${item.jumlah_waiting} Pasien` : "-",
    kelas: item.kelas_name || "-",
    id_kunjungan: item.id_kunjungan || "-",
    id_rm: item.id_rm || "-",
    nama_rm: item.patient_name || "-",
    rencana_pulang: formatDate(item.date_estimated_discharge) || "-",

    inserted_time: item.createdAt,
    inserted_by: item.createdName || "-",
    updated_time: item.updatedAt,
    updated_by: item.updatedName || "-",

    original: item,
  }));

  const fields = getSearchMonitoringBedFields();
  const fieldsTwo = getSearchMonitoringBedFieldsTwo(listBed, kamar, ruangList);

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPage(1);
  };

  const onSubmit = async (formData) => {
    const queryString = buildQueryString(formData);
    fetchMonitoringBed(queryString);
  };

  const onReset = async () => {
    fetchMonitoringBed();
  };

  useEffect(() => {
    if (ruangId) {
      const params = buildQueryString({ ruang_id: ruangId });
      fetchKamar(params);
    }
  }, [ruangId]);

  useEffect(() => {
    fetchMonitoringBed();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <SkeletonTable />
        </div>
      ) : (
        <div className="w-full h-full p-4 mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col w-full min-h-[16vh] border border-stone-400 rounded">
              <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
                data histori kamar pasien
              </div>
              <div className="p-4">
                <DynamicFormFields
                  fields={fields}
                  control={control}
                  errors={errors}
                  gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                />
                <DynamicFormFields
                  fields={fieldsTwo}
                  control={control}
                  errors={errors}
                  gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4 justify-end mb-5">
              <Button
                type="button"
                variant="red1"
                className="border-2 border-red2"
                size="sm"
                onClick={onReset}
              >
                <Icon icon="fluent:arrow-sync-12-filled" />
                Reset
              </Button>
              <Button type="submit" variant="primary3" size="sm">
                <Icon icon="mingcute:search-line" />
                Cari
              </Button>
            </div>
          </form>
          <Table
            data={formattedData}
            page={pagination?.current_page - 1}
            totalPage={Math.ceil(pagination?.total / rowsPerPage)}
            perPage={rowsPerPage}
            total={pagination?.total}
            defaultPinned={{ column: "", position: "" }}
            pin={formattedData.length > 0}
            sort={formattedData.length > 0}
            border="border"
            listIconButton={[
              {
                name: "input",
                value: true,
                icon: <Icon icon="ic:round-edit" />,
                variant: "yellow2",
                onClick: async (row) => {
                  const { setSelectedRow, fetchBedExist, fetchBedWaiting } =
                    useBedEditStore.getState();
                  setSelectedRow(row);

                  await Promise.all([
                    fetchBedExist(row.original?.id),
                    fetchBedWaiting(row.original?.id),
                  ]);

                  scrollToTop();
                },
              },
            ]}
            customWidths={{
              status: "min-w-[9rem]",
              kondisi_bed: "min-w-[9rem]",
              bed: "min-w-[10rem]",
              bed: "min-w-[10rem]",
              nama_rm: "min-w-[15rem]",
            }}
            hiddenColumns={["original"]}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      )}
    </>
  );
};

export default SearchMonitoringBed;
