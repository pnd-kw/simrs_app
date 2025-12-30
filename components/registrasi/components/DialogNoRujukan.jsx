import { useMemo, useState } from "react";
import { Button } from "../../ui/button";
import { Table } from "@/utils/table/table";
import SearchField from "@/utils/table/searchField";
import { Icon } from "@iconify/react";
import { getListRujukan } from "@/api_disabled/registrasi/rujukan";
import useDialog from "@/hooks/ui/use-dialog";
import { useFetchQuery } from "@/hooks/fetch/use-fetch-query";
import { useFilterAndPagination } from "@/hooks/utility/use-filter-and-pagination";
import SepHistory from "./SepHistory";
import useNoRujukan from "@/hooks/store/use-no-rujukan";

const tabMenu = [
  {
    key: "no_rujukan_klinik",
    title: "no rujukan klinik",
  },
  {
    key: "no_rujukan_rs",
    title: "no rujukan rs",
  },
  {
    key: "history_sep",
    title: "history sep",
  },
];

const mappedDataNoRujukan = (data) =>
  data?.map((item) => ({
    no_kunjungan: item.noKunjungan,
    tgl_kunjungan: item.tglKunjungan,
    tgl_habis_rujukan: item.tglHabisRujukan,
    jenis: item.pelayanan?.nama,
    nama: item.peserta?.nama,
    poli_rujukan: item.poliRujukan?.nama,
    status_aktif: !!item.statusAktif,
  }));

const DialogNoRujukan = ({ insuranceNo, formKey }) => {
  const [selectedTab, setSelectedTab] = useState("no_rujukan_klinik");
  const [searchRujukanFaskes1Value, setSearchRujukanFaskes1Value] =
    useState("");
  const [searchRujukanRsValue, setSearchRujukanRsValue] = useState("");

  const { setNoRujukan } = useNoRujukan(formKey);

  const { close } = useDialog();
  const [pagination, setPagination] = useState({
    faskes1: { page: 1, perPage: 10 },
    rs: { page: 1, perPage: 10 },
 
  });

  // Stabilkan filters dengan useMemo agar tidak refetch terus menerus karena filters berbentuk object sehingga reference nya bisa berbeda walaupun isi nya sama
  const faskes1ObjQuery = useMemo(() => {
    if (!insuranceNo) return null;
    return { no_kartu: insuranceNo, asal_rujukan: 0 };
  }, [insuranceNo]);

  const rsObjQuery = useMemo(() => {
    if (!insuranceNo) return null;
    return { no_kartu: insuranceNo, asal_rujukan: 1 };
  }, [insuranceNo]);

  // Fetch data untuk rujukan FKTP
  const { data: faskes1 } = useFetchQuery({
    queryKey: "rujukan faskes 1",
    apiFn: getListRujukan,
    filters: faskes1ObjQuery,
    mapFn: mappedDataNoRujukan,
    resKey: "data.rujukan",
    enabled: !!faskes1ObjQuery,
    withPagination: false,
  });

  // Fetch data untuk rujukan RS
  const { data: rs } = useFetchQuery({
    queryKey: "rujukan rs",
    apiFn: getListRujukan,
    filters: rsObjQuery,
    resKey: "data.rujukan",
    mapFn: mappedDataNoRujukan,
    enabled: !!rsObjQuery,
    withPagination: false,
  });

  // Filter dan paginasi untuk data rujukan FKTP
  const { data: filteredAndPaginatedFaskes1, total: totalFaskes1 } =
    useFilterAndPagination({
      data: faskes1?.items ?? [],
      filterValue: searchRujukanFaskes1Value,
      objKey: "no_kunjungan",
      paginationObj: pagination.faskes1,
    });

  // Filter dan paginasi untuk data rujukan RS
  const { data: filteredAndPaginatedRs, total: totalRs } =
    useFilterAndPagination({
      data: rs?.items ?? [],
      filterValue: searchRujukanRsValue,
      objKey: "no_kunjungan",
      paginationObj: pagination.rs,
    });

  return (
    <div className="flex flex-col w-full items-center justify-center space-y-2 overflow-auto">
      <div className="flex w-full px-2">
        {tabMenu.map((item) => (
          <div
            key={item.key}
            className="flex w-full items-center justify-center px-2 py-2 gap-2"
          >
            <Button
              variant={
                selectedTab === item.key ? "primaryGradient" : "outlinedGreen1"
              }
              className="min-w-[22vw] uppercase font-semibold rounded-sm"
              onClick={() => setSelectedTab(item.key)}
            >
              {item.title}
            </Button>
          </div>
        ))}
      </div>

      {selectedTab === "no_rujukan_klinik" && (
        <>
          <div className="flex w-full items-center justify-end px-6 py-2">
            <div className="flex">
              <SearchField
                value={searchRujukanFaskes1Value}
                onChange={setSearchRujukanFaskes1Value}
              />
            </div>
          </div>
          <div className="w-full px-2">
            <Table
              data={filteredAndPaginatedFaskes1}
              sort={false}
              pin={false}
              page={pagination.faskes1.page - 1}
              totalPage={Math.ceil(
                (faskes1?.items?.filter((item) =>
                  item.no_kunjungan
                    ?.toLowerCase()
                    .includes(searchRujukanFaskes1Value.toLowerCase())
                ).length ?? 0) / pagination.faskes1.perPage
              )}
              total={totalFaskes1}
              perPage={pagination.faskes1.perPage}
              border="border"
              header={[
                "no_kunjungan",
                "tgl_kunjungan",
                "tgl_habis_rujukan",
                "jenis",
                "nama",
                "poli_rujukan",
              ]}
              listIconButton={[
                {
                  name: "input",
                  value: true,
                  show: (row) => row.status_aktif,
                  icon: <Icon icon="token:get" />,
                  variant: "gray",
                  onClick: (row) => {
                    setNoRujukan(row.no_kunjungan);
                    close();
                  },
                },
              ]}
              customWidths={{
                no_kunjungan: "min-w-[11rem]",
                tgl_habis_rujukan: "max-w-[11rem]",
                jenis: "min-w-[7rem]",
                nama: "min-w-[8rem]",
                poli_rujukan: "min-w-[10rem]",
              }}
              hiddenColumns={["status_aktif"]}
              tableHeadTextSize="text-xs"
              onPageChange={(page) =>
                setPagination((prev) => ({
                  ...prev,
                  faskes1: { ...prev.faskes1, page: page + 1 },
                }))
              }
              onRowsPerPageChange={(perPage) =>
                setPagination((prev) => ({
                  ...prev,
                  faskes1: { ...prev.faskes1, perPage, page: 1 },
                }))
              }
              rowCondition={(row) => !row.status_aktif}
              rowColor={"bg-pink-300"}
            />
          </div>
        </>
      )}
      {selectedTab === "no_rujukan_rs" && (
        <>
          <div className="flex w-full items-center justify-end px-6 py-2">
            <div className="flex">
              <SearchField
                value={searchRujukanRsValue}
                onChange={setSearchRujukanRsValue}
              />
            </div>
          </div>
          <div className="w-full px-2">
            <Table
              data={filteredAndPaginatedRs}
              sort={false}
              pin={false}
              page={pagination.rs.page - 1}
              totalPage={Math.ceil(
                (rs?.items?.filter((item) =>
                  item.no_kunjungan
                    .toLowerCase()
                    .includes(searchRujukanRsValue.toLowerCase())
                ).length ?? 0) / pagination.rs.perPage
              )}
              total={totalRs}
              perPage={pagination.rs.perPage}
              border="border"
              header={[
                "no_kunjungan",
                "tgl_kunjungan",
                "tgl_habis_rujukan",
                "jenis",
                "nama",
                "poli_rujukan",
              ]}
              listIconButton={[
                {
                  name: "input",
                  value: true,
                  show: (row) => row.status_aktif,
                  icon: <Icon icon="token:get" />,
                  variant: "gray",
                  onClick: (row) => {
                    setNoRujukan(row.no_kunjungan);
                    close();
                  },
                },
              ]}
              customWidths={{
                no_kunjungan: "min-w-[10rem]",
                jenis: "min-w-[8rem]",
                nama: "min-w-[10rem]",
                poli_rujukan: "min-w-[10rem]",
              }}
              hiddenColumns={["status_aktif"]}
              tableHeadTextSize="text-xs"
              onPageChange={(page) =>
                setPagination((prev) => ({
                  ...prev,
                  rs: { ...prev.rs, page: page + 1 },
                }))
              }
              onRowsPerPageChange={(perPage) =>
                setPagination((prev) => ({
                  ...prev,
                  rs: { ...prev.rs, perPage, page: 1 },
                }))
              }
              rowCondition={(row) => !row.status_aktif}
              rowColor={"bg-pink-300"}
            />
          </div>
        </>
      )}
      {selectedTab === "history_sep" && (
        <SepHistory
          insuranceNo={insuranceNo}
          formKey={formKey}
          isClose={true}
        />
      )}
    </div>
  );
};

export default DialogNoRujukan;
