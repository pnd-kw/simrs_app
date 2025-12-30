import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePerusahaanStore } from "@/stores/master/useMasterStore";
import useScrollTopStore from "@/stores/useScrollTopStore";
import { SkeletonTable } from "@/utils/skeletonLoader";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { useEffect } from "react";

const SearchMasterPerusahaan = () => {
  const scrollToTop = useScrollTopStore((state) => state.scrollToTop);
  const {
    perusahaan,
    pagination,
    rowsPerPage,
    isLoading,
    fetchPerusahaan,
    setSelectedRow,
    setRowsPerPage,
    setPage,
  } = usePerusahaanStore();

  const formattedData = perusahaan.map((item) => ({
    id: item.id,
    nama_perusahaan: item.name,
    bank: item.bank || "-",
    no_virtual_account: item.no_virtual_account || "-",
    nama_virtual_account: item.nama_virtual_account || "-",
    alamat: item.address || "-",
    no_telepon: item.phone || "-",
    nama_kp: item.contactperson || "-",
    no_telepon_kp: item.cpmobilephone || "-",

    business: item.business,
    cpemail: item.cpemail,
    cpaddress: item.cpaddress,

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
    fetchPerusahaan();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <SkeletonTable />
        </div>
      ) : (
        <div className="w-full h-full p-4 mx-auto">
          <div className="flex justify-end p-4">
            <Button type="submit" variant="primary2">
              <Icon icon="mingcute:search-line" className="mr-1" />
              Cari
            </Button>
          </div>
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
                phone: "min-w-[10rem]",
              }}
              hiddenColumns={["cpemail", "cpaddress", "business"]}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Card>
        </div>
      )}
    </>
  );
};

export default SearchMasterPerusahaan;
