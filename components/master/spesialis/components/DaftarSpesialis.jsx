import { spesialis } from "@/api/master/spesialis";
import Spinner from "@/utils/spinner";
import SearchField from "@/utils/table/searchField";
import { Table } from "@/utils/table/table";
import { formatDate } from "@/utils/tanggal/formatDate";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const DaftarSpesialis = ({ setSelectedRow }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formattedData, setFormattedData] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  });
  const [searchSpesialis, setSearchSpesialis] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const mappedData = (data) =>
    data.map((item) => ({
      id: item.id,
      kode: item.code,
      bridge_kode_bpjs: item.codebridgepolibpjs,
      kode_bridge: item.codebridgepolibpjs,
      name: item.name,
      inserted_time: item.createdAt,
      inserted_by: item.createdName,
      updated_time: item.updatedAt,
      updated_by: item.updatedName,
    }));

  const fetchData = async (queryString) => {
    try {
      setIsLoading(true);
      const data = await spesialis(queryString);
      setFormattedData(mappedData(data.data));
      setPaginationInfo({
        current_page: data.meta.curent_page,
        total: data.meta.total,
        next_page_url: data.meta.next_page_url,
        prev_page_url: data.meta.prev_page_url,
        last_page: data.meta.last_page,
      });
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    if (!Number.isFinite(newPage)) return;

    const page = newPage + 1;
    const baseQuery = `${
      searchQuery ? `${searchQuery}&` : ""
    }page=${page}&per_page=${rowsPerPage}`;

    setPaginationInfo((prev) => ({
      ...prev,
      current_page: page,
    }));

    fetchData(baseQuery);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPaginationInfo((prev) => ({
      ...prev,
      current_page: 1,
    }));
    const baseQuery = `${
      searchQuery ? `${searchQuery}&` : ""
    }page=1&per_page=${newPerPage}`;
    fetchData(baseQuery);
  };

  useEffect(() => {
    fetchData(`page=1&per_page=${rowsPerPage}`);
  }, [rowsPerPage]);

  const filteredSpesialis = formattedData.filter((item) => {
    const searchLower = searchSpesialis.toLowerCase();
    return item.name?.toLowerCase().includes(searchLower);
  });

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner />
        </div>
      ) : (
        <div className="p-2">
          <h2 className="uppercase font-bold mb-2">daftar spesialis</h2>
          <div className="flex justify-end p-2 mb-2 gap-2">
            <div>
              <SearchField
                value={searchSpesialis}
                onChange={setSearchSpesialis}
              />
            </div>
          </div>
          <Table
            data={searchSpesialis ? filteredSpesialis : formattedData}
            page={paginationInfo?.current_page - 1}
            totalPage={Math.ceil(paginationInfo?.total / rowsPerPage)}
            perPage={rowsPerPage}
            total={paginationInfo?.total}
            defaultPinned={{ column: "id_rm", position: "left" }}
            listIconButton={[
              {
                name: "input",
                value: true,
                icon: <Icon icon="token:get" />,
                variant: "primary3",
                onClick: (row) => {
                  setSelectedRow(row);
                },
              },
              {
                name: "delete",
                value: true,
                icon: <Icon icon="mdi:trash" />,
                variant: "red1",
                onClick: (row) => {
                  setSelectedRow(row);
                },
              },
            ]}
            customWidths={{
              kode: "min-w-[7.5rem]",
              name: "min-w-[15rem]",
              bridge_kode_bpjs: "min-w-[12rem]",
              inserted_time: "min-w-[12rem]",
              inserted_by: "min-w-[12rem]",
              updated_time: "min-w-[12rem]",
              updated_by: "min-w-[13rem]",
              kode_bridge: "min-w-[12rem]",
            }}
            hiddenColumns={["id"]}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      )}
    </>
  );
};

export default DaftarSpesialis;
