import ReusableComboboxZod from "@/components/ReusableComboboxZod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListPoliklinikStore } from "@/stores/master/useMasterStore";
import { useDataDokterStore } from "@/stores/ws_bridging/useWsBridgingStore";
import DatePicker from "@/utils/datePicker";
import Spinner from "@/utils/spinner";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

const DataDokterForm = () => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      tgl_kontrol: new Date(),
      jenis_kontrol: "",
      kode_poli: "",
    },
  });

  const {
    dataDokter,
    setRowsPerPage,
    setPage,
    setSearchQuery,
    isLoading,
    pagination,
    rowsPerPage,
  } = useDataDokterStore();

  const { listPoliklinik, fetchListPoliklinik } = useListPoliklinikStore();

  const optionsJenisKontrol = [
    { value: 1, label: "Rawat Inap" },
    { value: 2, label: "Rawat Jalan" },
  ];

  const formattedData = dataDokter.map((item) => ({
    kode_dokter: item.kodeDokter || "-",
    nama_dokter: item.namaDokter || "-",
    kapasitas: item.kapasitas || "-",
    jadwal_praktek: item.jadwalPraktek || "-",
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

    let tgl_kontrol = formData.tgl_kontrol;
    if (tgl_kontrol instanceof Date && !isNaN(tgl_kontrol)) {
      tgl_kontrol = format(tgl_kontrol, "yyyy-MM-dd");
    }

    const finalData = {
      ...formData,
      tgl_kontrol,
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
            <div className="grid grid-cols-3 w-full gap-2 p-2">
              {/* Tanggal */}
              <div>
                <div className="flex min-h-6 w-full items-center justify-between">
                  <label
                    htmlFor="tgl_kontrol"
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
                      setValue("tgl_kontrol", today);
                    }}
                    style={{ fontSize: 9 }}
                  >
                    Today
                  </Button>
                </div>

                <DatePicker
                  name="tgl_kontrol"
                  control={control}
                  placeholder="dd / mm / yyyy"
                  showTime={true}
                />
              </div>

              {/* Spesialis */}
              <div>
                <label className="text-xs uppercase">spesialis</label>
                <Controller
                  name="kode_poli"
                  control={control}
                  render={({ field }) => (
                    <ReusableComboboxZod
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pilih Dokter"
                      options={listPoliklinik}
                    />
                  )}
                />
              </div>

              {/* Jenis Kontrol */}
              <div>
                <label className="text-xs uppercase">jenis kontrol</label>
                <Controller
                  name="jenis_kontrol"
                  control={control}
                  render={({ field }) => (
                    <ReusableComboboxZod
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pilih Jenis Kontrol"
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
                "kode_dokter",
                "nama_dokter",
                "kapasitas",
                "jadwal_praktek",
              ]}
              customWidths={{
                kode_dokter: "min-w-[21rem]",
                nama_dokter: "min-w-[25rem]",
                kapasitas: "min-w-[25rem]",
                jadwal_praktek: "min-w-[25rem]",
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

export default DataDokterForm;
