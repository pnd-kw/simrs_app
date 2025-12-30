import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDataBPJSStore } from "@/stores/ws_bridging/useWsBridgingStore";
import DatePicker from "@/utils/datePicker";
import Spinner from "@/utils/spinner";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";

const DataBPJSForm = () => {
  const { control, handleSubmit, setValue, register } = useForm({
    defaultValues: {
      no_kartu: "",
      date: new Date(),
    },
  });

  const {
    dataBPJS,
    setRowsPerPage,
    setPage,
    setSearchQuery,
    isLoading,
    pagination,
    rowsPerPage,
  } = useDataBPJSStore();

  const peserta = dataBPJS?.peserta || {};

  const formattedData =
    peserta && Object.keys(peserta).length > 0
      ? [
          {
            nik: peserta.nik || "-",
            nama_pasien: peserta.nama || "-",
            no_kartu: peserta.noKartu || "-",
            umur: peserta.umur?.umurSekarang || "-",
            kelas: peserta.hakKelas?.keterangan || "-",
            status: peserta.statusPeserta?.keterangan || "-",
          },
        ]
      : [];

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPage(1);
  };

  const onSearch = (formData) => {
    let date = formData.date;

    if (date instanceof Date && !isNaN(date)) {
      date = format(date, "yyyy-MM-dd");
    }

    const finalData = {
      ...formData,
      date,
    };

    const query = new URLSearchParams();
    Object.entries(finalData).forEach(([key, val]) => {
      if (val !== undefined && val !== "" && val !== null) {
        query.append(key, val);
      }
    });

    setSearchQuery(query.toString());
    setPage(1);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner />
        </div>
      ) : (
        <div className="w-full h-full p-4 mx-auto">
          <form onSubmit={handleSubmit(onSearch)}>
            <div className="grid grid-cols-2 w-full gap-2 p-2">
              <div>
                <label className="text-xs uppercase">NO. Kartu</label>
                <Input
                  type="text"
                  placeholder="NO. KARTU PESERTA"
                  {...register("no_kartu")}
                  className="w-full px-2 py-1 border rounded-md "
                />
              </div>
              <div>
                <div className="flex min-h-6 w-full items-center justify-between">
                  <label
                    htmlFor="date"
                    className="label-style"
                    style={{ fontSize: 9 }}
                  >
                    tanggal awal
                  </label>
                  <Button
                    type="button"
                    variant="text"
                    size="text"
                    onClick={() => {
                      const today = new Date();
                      setValue("date", today);
                    }}
                    style={{ fontSize: 9 }}
                  >
                    Today
                  </Button>
                </div>

                <DatePicker
                  name="date"
                  control={control}
                  placeholder="dd / mm / yyyy"
                  showTime={true}
                />
              </div>
            </div>
            <div className="flex justify-end p-4">
              <Button type="submit" variant="primary2">
                <Icon icon="mingcute:search-line" className="mr-1" />
                Cari
              </Button>
            </div>
          </form>

          <div className="border-b mb-5" />

          <Card className="p-4">
            <Table
              data={formattedData}
              page={pagination?.current_page - 1}
              totalPage={Math.ceil(pagination?.total / rowsPerPage)}
              perPage={rowsPerPage}
              total={pagination?.total}
              defaultPinned={{ column: "nama_pasien", position: "left" }}
              pin={formattedData.length > 0}
              sort={formattedData.length > 0}
              border="border"
              header={[
                "nama_pasien",
                "no_kartu",
                "nik",
                "umur",
                "kelas",
                "status",
              ]}
              customWidths={{
                nama_pasien: "min-w-[20rem]",
                no_kartu: "min-w-[15rem]",
                nik: "min-w-[15rem]",
                umur: "min-w-[15rem]",
                kelas: "min-w-[15rem]",
                status: "min-w-[15rem]",
              }}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Card>
        </div>
      )}
    </>
  );
};

export default DataBPJSForm;
