import ReusableComboboxZod from "@/components/ReusableComboboxZod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListPoliklinikStore } from "@/stores/master/useMasterStore";
import { useDataKunjunganStore } from "@/stores/ws_bridging/useWsBridgingStore";
import DatePicker from "@/utils/datePicker";
import Spinner from "@/utils/spinner";
import { optionsJenisKontrol } from "@/utils/static_options/staticData";
import { Table } from "@/utils/table/table";
import { formatDate } from "@/utils/tanggal/formatDate";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const DataKunjunganForm = () => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      tanggal_sep: new Date(),
      jenis_pelayanan: "",
    },
  });

  const {
    dataKunjungan,
    setRowsPerPage,
    setPage,
    setSearchQuery,
    isLoading,
    pagination,
    rowsPerPage,
  } = useDataKunjunganStore();

  const { listPoliklinik, fetchListPoliklinik } = useListPoliklinikStore();

  const formattedData = dataKunjungan.map((item) => ({
    nama_pasien: item.nama || "-",
    no_kartu: item.noKartu || "-",
    no_rujukan: item.noRujukan || "-",
    no_sep: item.noSep || "-",
    poli: item.poli || "-",
    diagnosa: item.diagnosa || "-",
    jenis_pelayanan: item.jnsPelayanan || "-",
    tgl_pulang_sep: formatDate(item.tglPlgSep) || "-",
    tgl_sep: formatDate(item.tglSep) || "-",
  }));

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPage(1);
  };

  const onSearch = (formData) => {
    const selectedPoliklinik = listPoliklinik.find(
      (opt) => opt.id === formData.kode_poli
    );
    const kode_poli = selectedPoliklinik?.kodebridge ?? null;

    let tanggal_sep = formData.tanggal_sep;
    if (tanggal_sep instanceof Date && !isNaN(tanggal_sep)) {
      tanggal_sep = format(tanggal_sep, "yyyy-MM-dd");
    }

    const finalData = {
      ...formData,
      tanggal_sep,
      kode_poli,
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

  useEffect(() => {
    fetchListPoliklinik();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner />
        </div>
      ) : (
        <div className="w-full h-screen p-4 mx-auto">
          <form onSubmit={handleSubmit(onSearch)}>
            <div className="grid grid-cols-2 w-full gap-2 p-2">
              {/* Tanggal */}
              <div>
                <div className="flex min-h-6 w-full items-center justify-between">
                  <label
                    htmlFor="tanggal_sep"
                    className="label-style"
                    style={{ fontSize: 9 }}
                  >
                    tanggal
                  </label>
                  <Button
                    type="button"
                    variant="text"
                    size="text"
                    onClick={() => {
                      const today = new Date();
                      setValue("tanggal_sep", today);
                    }}
                    style={{ fontSize: 9 }}
                  >
                    Today
                  </Button>
                </div>

                <DatePicker
                  name="tanggal_sep"
                  control={control}
                  placeholder="dd / mm / yyyy"
                  showTime={true}
                />
              </div>

              {/* Jenis Kontrol */}
              <div>
                <label className="text-xs uppercase">Jenis Pelayanan</label>
                <Controller
                  name="jenis_pelayanan"
                  control={control}
                  render={({ field }) => (
                    <ReusableComboboxZod
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pilih Jenis Pelayanan"
                      options={optionsJenisKontrol}
                    />
                  )}
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
              defaultPinned={{ column: "", position: "" }}
              pin={formattedData.length > 0}
              sort={formattedData.length > 0}
              border="border"
              header={[
                "nama_pasien",
                "no_kartu",
                "no_rujukan",
                "no_sep",
                "poli",
                "diagnosa",
                "jenis_pelayanan",
                "tgl_pulang_sep",
                "tgl_sep",
              ]}
              customWidths={{
                nama_pasien: "min-w-[11rem]",
                no_kartu: "min-w-[11rem]",
                no_rujukan: "min-w-[11rem]",
                no_sep: "min-w-[11rem]",
                diagnosa: "min-w-[11rem]",
                poli: "min-w-[11rem]",
                jenis_pelayanan: "min-w-[11rem]",
                tgl_pulang_sep: "min-w-[11rem]",
                tgl_sep: "min-w-[11rem]",
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

export default DataKunjunganForm;
