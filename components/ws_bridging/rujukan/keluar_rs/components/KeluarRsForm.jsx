import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useKeluarRsStore } from "@/stores/ws_bridging/useWsBridgingStore";
import DatePicker from "@/utils/datePicker";
import Spinner from "@/utils/spinner";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { format, parse } from "date-fns";
import { useForm } from "react-hook-form";

const KeluarRsForm = () => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      tanggal_mulai: new Date(),
      tanggal_selesai: new Date(),
    },
  });

  const {
    keluarRs,
    setRowsPerPage,
    setPage,
    setSearchQuery,
    isLoading,
    pagination,
    rowsPerPage,
  } = useKeluarRsStore();

  const formattedData = keluarRs.map((item) => ({
    nama_pasien: item.nama || "-",
    no_kartu: item.noKartu || "-",
    no_rujukan: item.noRujukan || "-",
    no_sep: item.noSep || "-",
    ppk_dirujuk: item.namaPpkDirujuk || "-",
    tanggal_rujukan: format(
      parse(item.tglRujukan, "dd-MM-yyyy", new Date()),
      "yyyy-MM-dd"
    ),
  }));

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPage(1);
  };

  const onSearch = (formData) => {
    let tanggal_mulai = formData.tanggal_mulai;
    let tanggal_selesai = formData.tanggal_selesai;

    if (tanggal_mulai instanceof Date && !isNaN(tanggal_mulai)) {
      tanggal_mulai = format(tanggal_mulai, "yyyy-MM-dd");
    }
    if (tanggal_selesai instanceof Date && !isNaN(tanggal_selesai)) {
      tanggal_selesai = format(tanggal_selesai, "yyyy-MM-dd");
    }

    const finalData = {
      ...formData,
      tanggal_mulai,
      tanggal_selesai,
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
                <div className="flex min-h-6 w-full items-center justify-between">
                  <label
                    htmlFor="tanggal_mulai"
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
                      setValue("tanggal_mulai", today);
                    }}
                    style={{ fontSize: 9 }}
                  >
                    Today
                  </Button>
                </div>

                <DatePicker
                  name="tanggal_mulai"
                  control={control}
                  placeholder="dd / mm / yyyy"
                  showTime={true}
                />
              </div>
              <div>
                <div className="flex min-h-6 w-full items-center justify-between">
                  <label
                    htmlFor="tanggal_selesai"
                    className="label-style"
                    style={{ fontSize: 9 }}
                  >
                    tanggal akhir
                  </label>
                  <Button
                    type="button"
                    variant="text"
                    size="text"
                    onClick={() => {
                      const today = new Date();
                      setValue("tanggal_selesai", today);
                    }}
                    style={{ fontSize: 9 }}
                  >
                    Today
                  </Button>
                </div>

                <DatePicker
                  name="tanggal_selesai"
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
                "no_rujukan",
                "ppk_dirujuk",
                "no_sep",
                "tanggal_rujukan",
              ]}
              customWidths={{
                nama_pasien: "min-w-[20rem]",
                no_kartu: "min-w-[15rem]",
                tanggal_rujukan: "min-w-[15rem]",
                no_sep: "min-w-[15rem]",
                ppk_dirujuk: "min-w-[16rem]",
                no_rujukan: "min-w-[15rem]",
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

export default KeluarRsForm;
