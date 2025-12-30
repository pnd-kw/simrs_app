import DynamicFormFields from "@/components/DynamicFormView";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useDialog from "@/hooks/ui/use-dialog";
import {
  useBedStore,
  useKamarStore,
  useKelasKamarStore,
} from "@/stores/master/useMasterStore";
import { buildQueryString } from "@/utils/buildQueryString";
import Spinner from "@/utils/spinner";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { getPopupHistoriBedFields } from "./PopupHistoriBedFields";

const PopupDialogHistoriBed = () => {
  const { close } = useDialog();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: { id: "", name: "", kamar_id: null, kelas_id: null },
  });

  const {
    beds,
    pagination,
    rowsPerPage,
    fetchBeds,
    setSelectedRow,
    setRowsPerPage,
    setPage,
    isLoading,
  } = useBedStore();

  const { fetchKamar, kamar } = useKamarStore();
  const { kelasKamar } = useKelasKamarStore();

  const mappedData = (data) =>
    data.map((item) => ({
      id: item.id,
      nama: item.name,
      ruang_aplicare: item.ruang_aplicares?.name || "-",
      kelas_kamar: item.kelas_id?.name || "-",
      ruang: item.name?.split(" ")[0] || "-",
      gol_kelas_aplicares: item.gol_golongankelasaplicares?.name || "-",
      kamar: item.kamar_id?.name || "-",
      kelas_kamar_sirs_online: item.kelaskamarsirsonline?.name || "-",
      status: (
        <span
          className={`block w-full p-2 ${
            item.status === 1 ? "bg-primary3" : "bg-stone-300"
          } rounded-md text-white text-center uppercase`}
        >
          {item.status === 1 ? "aktif" : "tidak aktif"}
        </span>
      ),
      inserted_time: item.createdAt,
      inserted_by: item.createdName || "-",
      updated_time: item.updatedAt,
      updated_by: item.updatedName || "-",

      original: item,
    }));

  const formattedData = mappedData(beds);
  const fields = getPopupHistoriBedFields(kamar, kelasKamar);

  const onSubmit = async (formData) => {
    const queryString = buildQueryString(formData);
    fetchBeds(queryString);
  };

  const onReset = async () => {
    fetchBeds();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPage(1);
  };

  useEffect(() => {
    fetchBeds();
    fetchKamar();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner />
        </div>
      ) : (
        <div className="p-4 max-h-[70vh] overflow-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mx-15">
              <DynamicFormFields
                fields={fields}
                control={control}
                errors={errors}
                gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
              />
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
                  icon: <Icon icon="token:get" />,
                  variant: "primary1",
                  onClick: (row) => {
                    setSelectedRow(row);
                    close();
                  },
                },
              ]}
              customWidths={{
                nama: "min-w-[10rem]",
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

export default PopupDialogHistoriBed;
