import DialogDelete from "@/components/DialogDelete";
import useDeleteTarget from "@/hooks/store/use-delete-target";
import useDialog from "@/hooks/ui/use-dialog";
import { useManagementDisplayStore } from "@/stores/management/antrian_display/display";
import useScrollTopStore from "@/stores/useScrollTopStore";
import { SkeletonTable } from "@/utils/skeletonLoader";
import SearchField from "@/utils/table/searchField";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";

const SearchDisplay = () => {
  const scrollToTop = useScrollTopStore((state) => state.scrollToTop);
  const { open, close } = useDialog();
  const { getTargetId, setId } = useDeleteTarget();
  const [searchDisplay, setSearchDisplay] = useState("");

  const {
    dataManagementDisplay,
    fetchManagementDisplay,
    pagination,
    rowsPerPage,
    isLoading,
    setSelectedRow,
    setRowsPerPage,
    setPage,
    deleteManagementDisplay,
  } = useManagementDisplayStore();

  const formattedData = dataManagementDisplay.map((item) => ({
    id: item.id,
    nama_display: item.name,
    jenis: item.jenis_id?.name || "-",
    status: (
      <span
        className={`block w-full p-2 ${
          item.status === true ? "bg-primary3" : "bg-stone-300"
        } rounded-md text-white text-center uppercase`}
      >
        {item.status === true ? "aktif" : "tidak aktif"}
      </span>
    ),
    keterangan: item.remark || "-",

    inserted_time: item.createdAt,
    inserted_by: item.createdName || "-",
    updated_time: item.updatedAt,
    updated_by: item.updatedName || "-",

    original: item,
  }));

  const handleDelete = async () => {
    const id = getTargetId();
    try {
      await deleteManagementDisplay(id);
      close();
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPage(1);
  };

  useEffect(() => {
    fetchManagementDisplay();
  }, []);

  const filteredData = formattedData.filter((item) => {
    const searchLower = searchDisplay.toLowerCase();
    return item.nama_display?.toLowerCase().includes(searchLower);
  });

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <SkeletonTable />
        </div>
      ) : (
        <div className="w-full h-full p-4 mx-auto">
          <div className="flex justify-between p-2 mb-2 gap-2">
            <div className="uppercase font-semibold">
              daftar antrian display
            </div>
            <div>
              <SearchField value={searchDisplay} onChange={setSearchDisplay} />
            </div>
          </div>
          <Table
            data={searchDisplay ? filteredData : formattedData}
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
                icon: <Icon icon="ic:round-edit" />,
                variant: "yellow2",
                onClick: (row) => {
                  setSelectedRow(row);
                  scrollToTop();
                },
              },
              {
                name: "delete",
                value: true,
                icon: <Icon icon="mdi:trash" />,
                variant: "red1",
                onClick: (row) => {
                  setId(row.id);
                  open({
                    minWidth: "min-w-[30vw]",
                    contentTitle: "Hapus Record",
                    headerColor: "bg-red1",
                    component: DialogDelete,
                    props: {
                      dialogImage: "/assets/exclamation-red-icon.svg",
                      data: {
                        prop1: row.id,
                        prop2: row.nama_display,
                      },
                      prop1: "ID DISPLAY",
                      prop2: "NAMA DISPLAY",
                      onDelete: handleDelete,
                    },
                  });
                },
              },
            ]}
            customWidths={{
              nama_display: "min-w-[20rem]",
              jenis: "min-w-[15rem]",
              keterangan: "min-w-[15rem]",
            }}
            hiddenColumns={["original"]}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      )}
    </>
  );
};

export default SearchDisplay;
