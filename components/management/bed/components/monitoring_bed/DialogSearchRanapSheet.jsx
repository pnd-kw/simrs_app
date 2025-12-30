import DynamicFormFields from "@/components/DynamicFormView";
import { Button } from "@/components/ui/button";
import useDialog from "@/hooks/ui/use-dialog";
import { useRawatInapStore } from "@/stores/rawat_inap/useRawatInapStore";
import { buildQueryString } from "@/utils/buildQueryString";
import { SkeletonTable } from "@/utils/skeletonLoader";
import { Table } from "@/utils/table/table";
import { todayString } from "@/utils/tanggal/formatDate";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getDialogSearchRanapSheetFields } from "./DialogSearchRanapSheetFields";

const DialogSearchRanapSheet = () => {
  const { close } = useDialog();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      search_column: ["all"],
      search_text: [""],
      tanggal_mulai: todayString,
      tanggal_selesai: todayString,
    },
  });

  const {
    dataRawatInap,
    fetchRawatInap,
    pagination,
    rowsPerPage,
    setSelectedRow,
    setRowsPerPage,
    setPage,
    isLoading,
  } = useRawatInapStore();

  const formattedData = dataRawatInap.map((item) => ({
    id_kunjungan: item.id,
    id_tagihan: item.tagihan_id,
    jenis_layanan: "Instalasi Rawat Inap",
    tanggal_registrasi: item.date || "-",
    nama_rm: item.rm_name || "-",
    id_rm: item.rm_norm || "-",
    asuransi: item.insurance_name || "-",
    perusahaan: item.company_name || "-",
    no_antrian: item.antrianno || "-",
    tanggal_lahir: item.rm_date_ob || "-",
    umur: item.umur || "-",

    inserted_time: item.createdAt,
    inserted_by: item.createdName || "-",
    updated_time: item.updatedAt,
    updated_by: item.updatedName || "-",

    original: item,
  }));

  const fields = getDialogSearchRanapSheetFields();

  const onSubmit = async (formData) => {
    const queryString = buildQueryString(formData);
    fetchRawatInap(queryString);
  };

  const onReset = async () => {
    fetchRawatInap();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPage(1);
  };

  useEffect(() => {
    fetchRawatInap();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <SkeletonTable />
        </div>
      ) : (
        <div className="p-4 max-h-[70vh] overflow-auto">
          <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <DynamicFormFields
                fields={fields}
                control={control}
                errors={errors}
                gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="destructive"
                className="rounded-sm"
                onClick={onReset}
              >
                <Icon icon="fluent:arrow-sync-12-filled" />
                Reset
              </Button>
              <Button type="submit" variant="primary2">
                <Icon icon="mingcute:search-line" className="mr-1" />
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
                icon: <Icon icon="token:get" />,
                variant: "primary1",
                onClick: (row) => {
                  setSelectedRow(row);
                  close();
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
        </div>
      )}
    </>
  );
};

export default DialogSearchRanapSheet;
