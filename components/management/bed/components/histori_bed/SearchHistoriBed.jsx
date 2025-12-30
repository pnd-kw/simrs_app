import DialogDelete from "@/components/DialogDelete";
import DynamicFormFields from "@/components/DynamicFormView";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useDeleteTarget from "@/hooks/store/use-delete-target";
import useDialog from "@/hooks/ui/use-dialog";
import { useHistoriBedStore } from "@/stores/management/bed/useBedManagementStore";
import useScrollTopStore from "@/stores/useScrollTopStore";
import { SkeletonTable } from "@/utils/skeletonLoader";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  defaultFormValuesSearchHistoriBed,
  getSearchHistoriBedFields,
} from "./SearchProfileRekamMedisFields";
import { buildQueryString } from "@/utils/buildQueryString";
import { useListBedStore } from "@/stores/master/useMasterStore";

const SearchHistoriBed = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: defaultFormValuesSearchHistoriBed,
  });

  const scrollToTop = useScrollTopStore((state) => state.scrollToTop);
  const { open } = useDialog();
  const { getTargetId, setId } = useDeleteTarget();
  const { listBed } = useListBedStore();

  const {
    dataHistoriBed,
    pagination,
    rowsPerPage,
    isLoading,
    fetchHistoriBed,
    setSelectedRow,
    setRowsPerPage,
    setPage,
    deleteHistoriBed,
  } = useHistoriBedStore();

  const fields = getSearchHistoriBedFields(listBed);

  const formattedData = dataHistoriBed.map((item) => ({
    bed: item.bed_name,
    kamar: item.kamar_name,
    ruang: item.ruang_name || "-",
    kelas: item.kelas_name || "-",
    id_kunjungan: item.id_kunjungan || "-",
    id_rm: item.id_rm || "-",
    nama_rm: item.patient_name || "-",
    no_sep: item.address_now || "-",
    tanggal_waiting: item.date_waiting || "-",
    tanggal_masuk: item.date_start || "-",
    tanggal_keluar: item.date_estimated_discharge || "-",

    inserted_time: item.createdAt,
    inserted_by: item.createdName || "-",
    updated_time: item.updatedAt,
    updated_by: item.updatedName || "-",

    original: item,
  }));

  const handleDelete = async () => {
    const id = getTargetId();
    try {
      await deleteHistoriBed(id);
      close();
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  const onSubmit = async (formData) => {
    const queryString = buildQueryString(formData);
    fetchHistoriBed(queryString);
  };

  const onReset = async () => {
    fetchHistoriBed();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPage(1);
  };

  useEffect(() => {
    fetchHistoriBed();
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
              </div>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
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
          <Card className="p-4 mt-4">
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
                  onClick: (row) => {
                    setSelectedRow(row);
                    scrollToTop();
                  },
                },
                {
                  name: "delete",
                  value: true,
                  icon: <Icon icon="mdi:trash" />,
                  variant: "red1",
                  onClick: (row) => {
                    setId(row.id_rm);
                    open({
                      minWidth: "min-w-[30vw]",
                      contentTitle: "Hapus Record",
                      headerColor: "bg-red1",
                      component: DialogDelete,
                      props: {
                        dialogImage: "/assets/exclamation-red-icon.svg",
                        data: {
                          prop1: row.id_rm,
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
                bed: "min-w-[10rem]",
                nama_rm: "min-w-[15rem]",
              }}
              hiddenColumns={["original"]}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Card>
        </div>
      )}
    </>
  );
};

export default SearchHistoriBed;
