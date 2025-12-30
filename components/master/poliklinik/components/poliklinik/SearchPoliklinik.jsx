import { Card } from "@/components/ui/card";
import { usePoliklinikStore } from "@/stores/master/useMasterStore";
import useScrollTopStore from "@/stores/useScrollTopStore";
import { SkeletonTable } from "@/utils/skeletonLoader";
import SearchField from "@/utils/table/searchField";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const SearchPoliklinik = () => {
  const [searchPoliklinik, setSearchPoliklinik] = useState("");
  const scrollToTop = useScrollTopStore((state) => state.scrollToTop);
  const {
    poliklinik,
    pagination,
    rowsPerPage,
    isLoading,
    fetchPoliklinik,
    setSelectedRow,
    setRowsPerPage,
    setPage,
  } = usePoliklinikStore();

  const formattedData = poliklinik.map((item) => ({
    id: item.id,
    kode: item.code,
    nama: item.name || "-",
    no_poli: item.no_poli || "-",
    kode_bridge: item.kodebridge || "-",
    catatan: item.remark || "-",

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
    fetchPoliklinik();
  }, []);

  const filteredPoliklinik = formattedData.filter((item) => {
    const searchLower = searchPoliklinik.toLowerCase();
    return item.nama?.toLowerCase().includes(searchLower);
  });

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <SkeletonTable />
        </div>
      ) : (
        <div className="w-full h-full p-4 mx-auto">
          <div className="flex justify-end p-4">
            <div>
              <SearchField
                value={searchPoliklinik}
                onChange={setSearchPoliklinik}
              />
            </div>
          </div>
          <div className="border-b mb-5" />
          <Card className="p-4">
            <Table
              data={searchPoliklinik ? filteredPoliklinik : formattedData}
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
                kode: "min-w-[15rem]",
                no_poli: "min-w-[10rem]",
                kode_bridge: "min-w-[10rem]",
                catatan: "min-w-[10rem]",
              }}
              hiddenColumns={["id"]}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Card>
        </div>
      )}
    </>
  );
};

export default SearchPoliklinik;
