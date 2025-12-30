import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDataPelayananStore } from "@/stores/ws_bridging/useWsBridgingStore";
import DatePicker from "@/utils/datePicker";
import Spinner from "@/utils/spinner";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";

const DataPelayananForm = () => {
  const { control, handleSubmit, setValue, register } = useForm({
    defaultValues: {
      nomor_kartu: "",
      tanggal_mulai: new Date(),
      tanggal_selesai: new Date(),
    },
  });

  const {
    dataPelayanan,
    setRowsPerPage,
    setPage,
    setSearchQuery,
    isLoading,
    pagination,
    rowsPerPage,
  } = useDataPelayananStore();

  const formattedData = dataPelayanan.map((item) => ({
    nama_pasien: item.namaPeserta || "-",
    no_kartu: item.noKartu || "-",
    no_rujukan: item.noRujukan || "-",
    no_sep: item.noSep || "-",
    poli: item.poli || "-",
    pelayanan: item.ppkPelayanan || "-",
    diagnosa: item.diagnosa || "-",
    jenis_pelayanan: item.jnsPelayanan === "1" ? "Rawat Inap" : "Rawat Jalan",
    tgl_pulang_sep: item.tglPlgSep || "-",
    tgl_sep: item.tglSep || "-",
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
            <div className="grid grid-cols-3 w-full gap-2 p-2">
              <div>
                <label className="text-xs uppercase">NO. Kartu</label>
                <Input
                  type="text"
                  placeholder="NO. KARTU PESERTA"
                  {...register("nomor_kartu")}
                  className="w-full px-2 py-1 border rounded-md "
                />
              </div>
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
                "no_sep",
                "poli",
                "pelayanan",
                "diagnosa",
                "jenis_pelayanan",
                "tgl_pulang_sep",
                "tgl_sep",
              ]}
              customWidths={{
                nama_pasien: "min-w-[10rem]",
                no_kartu: "min-w-[10rem]",
                tanggal_rujukan: "min-w-[10rem]",
                no_sep: "min-w-[11rem]",
                no_rujukan: "min-w-[11rem]",
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

export default DataPelayananForm;
