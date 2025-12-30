import DialogDelete from "@/components/DialogDelete";
import DynamicFormFields from "@/components/DynamicFormView";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useDeleteTarget from "@/hooks/store/use-delete-target";
import useDialog from "@/hooks/ui/use-dialog";
import { useProfileRekamMedisStore } from "@/stores/management/profile_rekam_medis/useProfileRekamMedis";
import useScrollTopStore from "@/stores/useScrollTopStore";
import { buildQueryString } from "@/utils/buildQueryString";
import { SkeletonTable } from "@/utils/skeletonLoader";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { intervalToDuration } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  defaultFormValuesSearchProfileRekamMedis,
  getSearchProfileRMFields
} from "./SearchProfileRekamMedisFields";

const SearcProfileRekamMedis = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: defaultFormValuesSearchProfileRekamMedis,
  });
  const scrollToTop = useScrollTopStore((state) => state.scrollToTop);
  const {
    dataProfileRM,
    pagination,
    rowsPerPage,
    isLoading,
    fetchProfileRekamMedis,
    setSelectedRow,
    setRowsPerPage,
    setPage,
    deleteProfileRekamMedis,
  } = useProfileRekamMedisStore();

  const { getTargetId, setId } = useDeleteTarget();
  const { open, close } = useDialog();

  const handleDelete = async () => {
    const id = getTargetId();
    try {
      await deleteProfileRekamMedis(id);
      close();
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  function formatUmurLengkap(dateObString) {
    if (!dateObString) return "-";
    const birthDate = new Date(dateObString);
    if (isNaN(birthDate.getTime())) return "-";

    const today = new Date();
    const duration = intervalToDuration({ start: birthDate, end: today });

    const tahun = duration.years || 0;
    const bulan = duration.months || 0;
    const hari = duration.days || 0;

    return `${tahun} th ${bulan} bl ${hari} hr`;
  }

  const fields = getSearchProfileRMFields();

  const formattedData = dataProfileRM.map((item) => ({
    id_rm: item.id,
    nama_rm: item.fullname,
    id_ihs: item.id_ihs || "-",
    status: (
      <span
        className={`block w-full p-2 ${
          item.status === true ? "bg-primary3" : "bg-stone-300"
        } rounded-md text-white text-center uppercase`}
      >
        {item.status === true ? "aktif" : "tidak aktif"}
      </span>
    ),
    asuransi: item.insurance_id?.name || "-",
    no_asuransi: item.insurance_number || "-",
    umur: formatUmurLengkap(item.date_ob) || "-",
    tempat_lahir: item.place_ob || "-",
    tanggal_lahir: item.date_ob || "-",
    alamat: item.address_now || "-",
    nik: item.nik || "-",
    kota: item.province?.name || "-",

    inserted_time: item.createdAt,
    inserted_by: item.createdName || "-",
    updated_time: item.updatedAt,
    updated_by: item.updatedName || "-",

    original: item,
  }));

  const onSubmit = async (formData) => {
    const queryString = buildQueryString(formData);
    fetchProfileRekamMedis(queryString);
  };

  const onReset = async () => {
    fetchProfileRekamMedis();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPage(1);
  };

  useEffect(() => {
    fetchProfileRekamMedis();
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
                cari profile rekam medis
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
                nama: "min-w-[15rem]",
                phone: "min-w-[10rem]",
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

export default SearcProfileRekamMedis;
