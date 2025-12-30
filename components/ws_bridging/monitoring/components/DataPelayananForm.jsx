import ReusableComboboxZod from "@/components/ReusableComboboxZod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useListPoliklinikStore } from "@/stores/master/useMasterStore";
import { useDataKlaimStore } from "@/stores/ws_bridging/useWsBridgingStore";
import DatePicker from "@/utils/datePicker";
import Spinner from "@/utils/spinner";
import {
  optionsJenisKontrol,
  optionsStatusEklaim,
} from "@/utils/static_options/staticData";
import { Table } from "@/utils/table/table";
import { formatDate } from "@/utils/tanggal/formatDate";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const DataKlaimForm = () => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      tanggal_pulang: new Date(),
      jenis_pelayanan: "",
      status: "",
    },
  });

  const {
    dataKlaim,
    setRowsPerPage,
    setPage,
    setSearchQuery,
    isLoading,
    pagination,
    rowsPerPage,
  } = useDataKlaimStore();

  const formattedData = dataKlaim.map((item) => ({
    nama_pasien: item.peserta?.nama || "-",
    no_kartu: item.peserta?.noKartu || "-",
    no_rm: item.peserta?.noMR || "-",
    no_sep: item.noSEP || "-",
    no_fpk: item.noFPK || "-",
    poli: item.poli || "-",
    status: item.status || "-",
    tgl_pulang: formatDate(item.tglPulang) || "-",
    tgl_sep: formatDate(item.tglSep) || "-",
    jenis_pelayanan: item.kelasRawat || "-",
    jumlah_pengajuan: item.biaya?.byPengajuan || "-",
    jumlah_tarif_grouper: item.biaya?.byTarifGruper || "-",
    jumlah_topup: item.biaya?.byTopup || "-",
    jumlah_tarif_rs: item.biaya?.byTarifRS || "-",
    jumlah_setujui: item.biaya?.bySetujui || "-",
    sisa: item.biaya
      ? Number(item.biaya.byPengajuan) - Number(item.biaya.bySetujui)
      : "-",
    kode: item.Inacbg?.kode || "-",
    nama: item.Inacbg?.nama || "-",
  }));

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPage(1);
  };

  const onSearch = (formData) => {
    let tanggal_pulang = formData.tanggal_pulang;
    if (tanggal_pulang instanceof Date && !isNaN(tanggal_pulang)) {
      tanggal_pulang = format(tanggal_pulang, "yyyy-MM-dd");
    }

    const finalData = {
      ...formData,
      tanggal_pulang,
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
                <div className="flex min-h-6 w-full items-center justify-between">
                  <label
                    htmlFor="tanggal_pulang"
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
                      setValue("tanggal_pulang", today);
                    }}
                    style={{ fontSize: 9 }}
                  >
                    Today
                  </Button>
                </div>

                <DatePicker
                  name="tanggal_pulang"
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
              <div>
                <label className="text-xs uppercase">Jenis Pelayanan</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <ReusableComboboxZod
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pilih Jenis Pelayanan"
                      options={optionsStatusEklaim}
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
              defaultPinned={{ column: "nama_pasien", position: "left" }}
              pin={formattedData.length > 0}
              sort={formattedData.length > 0}
              border="border"
              header={[
                "nama_pasien",
                "no_kartu",
                "no_rm",
                "no_sep",
                "no_fpk",
                "poli",
                "status",
                "jenis_pelayanan",
                "tgl_pulang",
                "tgl_sep",
                "jumlah_pengajuan",
                "jumlah_tarif_grouper",
                "jumlah_topup",
                "jumlah_tarif_rs",
                "jumlah_setujui",
                "sisa",
                "kode",
                "nama",
              ]}
              customWidths={{
                nama_pasien: "min-w-[14rem]",
                no_kartu: "min-w-[11rem]",
                no_rm: "min-w-[9rem]",
                no_sep: "min-w-[13rem]",
                no_fpk: "min-w-[12rem]",
                poli: "min-w-[13rem]",
                status: "min-w-[12rem]",
                jenis_pelayanan: "min-w-[12rem]",
                tgl_pulang: "min-w-[11rem]",
                tgl_sep: "min-w-[11rem]",
                jumlah_pengajuan: "min-w-[13rem]",
                jumlah_tarif_grouper: "min-w-[15rem]",
                jumlah_topup: "min-w-[12rem]",
                jumlah_tarif_rs: "min-w-[13rem]",
                jumlah_setujui: "min-w-[13rem]",
                sisa: "min-w-[10rem]",
                kode: "min-w-[10rem]",
                nama: "min-w-[20rem]",
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

export default DataKlaimForm;
