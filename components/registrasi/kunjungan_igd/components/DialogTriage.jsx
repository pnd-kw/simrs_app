import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Table } from "@/utils/table/table";
import useDialog from "@/hooks/ui/use-dialog";
import DatePicker from "@/utils/datePicker";
import { SkeletonTable } from "@/utils/skeletonLoader";
import { useFetchQuery } from "@/hooks/fetch/use-fetch-query";
import { searchTriage } from "@/api/registrasi/igd";
import toastWithProgress from "@/utils/toast/toastWithProgress";

const mappedData = (data) =>
  data.map((item) => ({
    id: item.id_triage,
    nama_pasien: item.nama_pasien,
    status_asesmen: item.asesmen_triage,
    status_emergency_ats: item.emergency,
    status_emergency_pmk_47: item.emergency_pmk,
    doctor_id: item.id_dokter,
    tanggal_lahir: item.tanggal_lahir,
    nik: item.nik,
    tanggal_masuk: item.tanggal_masuk,
    inserted_time: item.inserted_date,
    inserted_by: item.inserted_user,
    updated_time: item.updated_date,
    updated_by: item.updated_user,
  }));

const DialogTriage = ({ onSelectedRowChange, parentComponent }) => {
  const { register, control, handleSubmit } = useForm({
    defaultValues: { from: new Date(), to: new Date() },
  });

  const { close } = useDialog();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading } = useFetchQuery({
    queryKey: "triage",
    apiFn: searchTriage,
    filters,
    page,
    perPage: rowsPerPage,
    mapFn: mappedData,
  });

  const onSubmit = async (formData) => {
    setFilters(formData);
    setPage(1);
  };

  return (
    <div className="flex flex-col w-full h-full justify-center bg-white p-4 space-y-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4 pb-4">
          <div className="flex flex-col w-full">
            <div className="flex w-full items-center justify-between">
              <label
                htmlFor="from"
                className="label-style"
                style={{ fontSize: 9 }}
              >
                tanggal mulai
              </label>
              <Button
                type="button"
                variant="text"
                size="text"
                onClick={() => {}}
                style={{ fontSize: 9 }}
              >
                Today
              </Button>
            </div>
            <div className="flex w-full items-center justify-between">
              <DatePicker
                name="from"
                control={control}
                placeholder="dd / mm / yyyy"
                triggerByIcon={true}
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex w-full items-center justify-between">
              <label
                htmlFor="from"
                className="label-style"
                style={{ fontSize: 9 }}
              >
                tanggal selesai
              </label>
              <Button
                type="button"
                variant="text"
                size="text"
                onClick={() => {}}
                style={{ fontSize: 9 }}
              >
                Today
              </Button>
            </div>
            <div className="flex w-full items-center justify-between">
              <DatePicker
                name="to"
                control={control}
                placeholder="dd / mm / yyyy"
                triggerByIcon={true}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-end">
          <Button type="submit" variant="outlined">
            <Icon icon="mingcute:search-line" /> Cari
          </Button>
        </div>
      </form>
      <div className="w-[72vw]">
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <Table
            data={data?.items ?? []}
            page={page - 1}
            totalPage={data ? data.meta.last_page : 1}
            perPage={rowsPerPage}
            total={data ? data.meta.total : 0}
            defaultPinned={{ column: "nama_pasien", position: "left" }}
            pin={data?.items.length > 0}
            sort={data?.items.length > 0}
            border="border"
            header={[
              "nama_pasien",
              "status_asesmen",
              "status_emergency_ats",
              "status_emergency_pmk_47",
              "tanggal_lahir",
              "nik",
              "tanggal_masuk",
              "inserted_time",
              "inserted_by",
              "updated_time",
              "updated_by",
            ]}
            listIconButton={[
              {
                name: "input",
                value: true,
                icon: <Icon icon="token:get" />,
                variant: "primary3",
                onClick: (row) => {
                  if (row?.status_asesmen === "Belum Asesmen") {
                    toastWithProgress({
                      title: "Gagal memilih data",
                      description: "Pasien belum di lakukan asesmen",
                      duration: 3000,
                      type: "error",
                    });
                  } else if (row?.status_asesmen === "Sudah Asesmen") {
                    const requiredData = {
                      id_triage: row?.id,
                      nama: row?.nama_pasien,
                      doctor_id: row?.doctor_id,
                    };
                    onSelectedRowChange(requiredData);
                    close();
                  } else {
                    toastWithProgress({
                      title: "Status tidak dikenali",
                      description: `Status asesmen: ${
                        row?.status_asesmen || "kosong"
                      }`,
                      duration: 3000,
                      type: "error",
                    });
                  }
                },
              },
            ]}
            customWidths={{
              nama_pasien: "min-w-[11rem]",
              status_asesmen: "min-w-[12rem]",
              status_emergency_ats: "min-w-[15rem]",
              status_emergency_pmk_47: "min-w-[17rem]",
              tanggal_lahir: "min-w-[12rem]",
              nik: "min-w-[10rem]",
              tanggal_masuk: "min-w-[12rem]",
              inserted_time: "min-w-[11rem]",
              inserted_by: "min-w-[12rem]",
              updated_time: "min-w-[12rem]",
              updated_by: "min-w-[12rem]",
            }}
            hiddenColumns={["id", "doctor_id"]}
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

export default DialogTriage;
