import ReusableComboboxZod from "@/components/ReusableComboboxZod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useJadwalDokterStore,
  useListDokterStore,
} from "@/stores/master/useMasterStore";
import useScrollTopStore from "@/stores/useScrollTopStore";
import { SkeletonTable } from "@/utils/skeletonLoader";
import { Table } from "@/utils/table/table";
import { getNamaHari } from "@/utils/tanggal/formatDate";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { optionsHari } from "./JadwalDokterFields";

const SearchJadwalDokter = () => {
  const scrollToTop = useScrollTopStore((state) => state.scrollToTop);
  const {
    jadwalDokter,
    pagination,
    rowsPerPage,
    isLoading,
    fetchJadwalDokter,
    setSelectedRow,
    setRowsPerPage,
    setPage,
    setSearchQuery,
  } = useJadwalDokterStore();

  const [searchForm, setSearchForm] = useState({
    doctor_id: "",
    day: "",
    status: "1",
  });

  const { listDokter, fetchListDokter } = useListDokterStore();

  const formattedData = jadwalDokter.map((item) => ({
    status: (
      <span
        className={`block w-full p-2 ${
          item.status === true ? "bg-primary3" : "bg-stone-300"
        } rounded-md text-white text-center uppercase`}
      >
        {item.status === true ? "aktif" : "tidak aktif"}
      </span>
    ),
    id: item.id,
    nama: item.doctor_id?.fullname || "-",
    poliklinik: item.poli_code?.name || "-",
    hari: getNamaHari(item.day),
    mulai: item.time_start,
    selesai: item.time_finish,
    kuota: item.quota,
    kuota_jkn: item.quota_jkn,
    kuota_vip: item.vip_quota,
    wkt_pelayanan_per_pasien: item.waktu_pelayanan_per_pasien || "-",

    doctor_id: item.doctor_id?.id,
    initial: item.initial,
    poli_code: item.poli_code?.code,
    layanan_id: item.layanan_id?.id,
    status_jadwal: item.status_jadwal,

    inserted_time: item.createdAt,
    inserted_by: item.createdName || "-",
    updated_time: item.updatedAt,
    updated_by: item.updatedName || "-",
  }));

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPage(1);
  };

  useEffect(() => {
    fetchJadwalDokter();
    fetchListDokter();
  }, []);

  const onSearch = (formData) => {
    const query = new URLSearchParams();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        query.append(key, val);
      }
    });
    setSearchQuery(query.toString());
  };

  const resetSearchForm = () => {
    setSearchForm({
      doctor_id: "",
      day: "",
      status: "1",
    });
    setSearchQuery("");
    fetchJadwalDokter();
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <SkeletonTable />
        </div>
      ) : (
        <div className="w-full h-full p-4 mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch(searchForm);
              setPage(1);
            }}
          >
            <div className="flex p-4">
              <div className="grid grid-cols-3 w-full gap-4">
                <div>
                  <label className="text-xs uppercase">dokter</label>
                  <ReusableComboboxZod
                    value={searchForm.doctor_id}
                    placeholder="Pilih Dokter"
                    onChange={(val) =>
                      setSearchForm((prev) => ({ ...prev, doctor_id: val }))
                    }
                    options={listDokter}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase">hari</label>
                  <ReusableComboboxZod
                    value={searchForm.day}
                    placeholder="Pilih Hari"
                    onChange={(val) =>
                      setSearchForm((prev) => ({ ...prev, day: val }))
                    }
                    options={optionsHari}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase">status</label>
                  <ReusableComboboxZod
                    value={searchForm.status}
                    placeholder="Pilih Status"
                    onChange={(val) =>
                      setSearchForm((prev) => ({ ...prev, status: val }))
                    }
                    options={[
                      { label: "Aktif", value: "1" },
                      { label: "Tidak Aktif", value: "0" },
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between p-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetSearchForm}
                className="rounded-sm border-red1 text-red1 hover:bg-red1 hover:text-white"
              >
                Reset
              </Button>
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
              defaultPinned={
                ({ column: "status", position: "left" },
                { column: "id", position: "left" })
              }
              pin={formattedData.length > 0}
              sort={formattedData.length > 0}
              border="border"
              listIconButton={[
                {
                  name: "input",
                  value: true,
                  icon: <Icon icon="token:get" />,
                  variant: "primary3",
                  onClick: (row) => {
                    setSelectedRow(row);
                    scrollToTop();
                  },
                },
              ]}
              customWidths={{
                nama: "min-w-[15rem]",
                poliklinik: "min-w-[15rem]",
              }}
              hiddenColumns={[
                "doctor_id",
                "initial",
                "poli_code",
                "layanan_id",
                "status_jadwal",
              ]}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Card>
        </div>
      )}
    </>
  );
};

export default SearchJadwalDokter;
