import { Card } from "@/components/ui/card";
import { useAsuransiStore } from "@/stores/master/useMasterStore";
import useScrollTopStore from "@/stores/useScrollTopStore";
import { SkeletonTable } from "@/utils/skeletonLoader";
import SearchField from "@/utils/table/searchField";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const SearchMasterAsuransi = () => {
  const scrollToTop = useScrollTopStore((state) => state.scrollToTop);
  const {
    asuransi,
    pagination,
    rowsPerPage,
    isLoading,
    fetchAsuransi,
    setSelectedRow,
    setRowsPerPage,
    setPage,
  } = useAsuransiStore();

  const formattedData = asuransi.map((item) => ({
    id: item.id,
    nama_asuransi: item.name,
    status: (
      <span
        className={`block w-full p-2 ${
          item.status === true ? "bg-primary3" : "bg-stone-300"
        } rounded-md text-white text-center uppercase`}
      >
        {item.status === true ? "aktif" : "tidak aktif"}
      </span>
    ),
    bank: item.bank || "-",
    no_virtual_account: item.no_virtual_account || "-",
    nama_virtual_account: item.nama_virtual_account || "-",
    alamat: item.address || "-",
    no_telepon: item.phone || "-",
    nama_kp: item.contactperson || "-",
    no_telepon_kp: item.cpmobilephone || "-",

    harga_id: item.harga_id?.id,
    insurance_type_id: item.insurance_type_id?.id,
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
    fetchAsuransi();
  }, []);

  const [searchAsuransi, setSearchAsuransi] = useState("");

  const filteredAsuransi = formattedData.filter((item) => {
    const searchLower = searchAsuransi.toLowerCase();
    return item.nama_asuransi?.toLowerCase().includes(searchLower);
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
                value={searchAsuransi}
                onChange={setSearchAsuransi}
              />
            </div>
          </div>
          <Card className="p-4">
            <Table
              data={searchAsuransi ? filteredAsuransi : formattedData}
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
              hiddenColumns={[
                "harga_id",
                "insurance_type_id",
                "cpemail",
                "cpaddress",
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

export default SearchMasterAsuransi;
