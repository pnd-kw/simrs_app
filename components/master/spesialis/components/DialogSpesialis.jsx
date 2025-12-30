import { kodeBridgePoliklinik } from "@/api_disabled/master/spesialis";
import { Button } from "@/components/ui/button";
import SearchField from "@/utils/table/searchField";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const DialogSpesialis = ({ setSelectedRow, onCloseDialog }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formattedData, setFormattedData] = useState([]);
  const [searchKodeBridge, setSearchKodeBridge] = useState("");
  const [paginationInfo, setPaginationInfo] = useState({
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  });

  const mappedData = (data) =>
    data.map((item) => ({
      nama_poli: item.nmpoli,
      kode_poli: item.kdpoli,
      nama_subspesialis: item.nmsubspesialis,
      kode_subspesialis: item.kdsubspesialis,
    }));

  const fetchData = async (query = "per_page=10") => {
    try {
      setIsLoading(true);
      const data = await kodeBridgePoliklinik(query);

      setFormattedData(mappedData(data.data));
      setPaginationInfo({
        current_page: data.meta.current_page,
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

  const buildQueryString = (page = 1, perPage = rowsPerPage) => {
    const baseParams = new URLSearchParams("");
    baseParams.set("page", page);
    baseParams.set("per_page", perPage);
    return baseParams.toString();
  };

  const goToPage = (targetPage, perPage = rowsPerPage) => {
    const query = buildQueryString(targetPage, perPage);
    setPaginationInfo((prev) => ({
      ...prev,
      current_page: targetPage,
    }));
    fetchData(query);
  };

  const handlePageChange = (newPage) => {
    goToPage(newPage + 1);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    goToPage(1, newPerPage);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredKodeBridge = formattedData.filter((item) => {
    const searchLower = searchKodeBridge.toLowerCase();
    return item.nama_poli?.toLowerCase().includes(searchLower);
  });

  return (
    <div className="flex flex-col w-full h-full items-center justify-center bg-white p-4 space-y-2">
      <div className="w-[55vw] p-2">
        <div className="flex justify-end p-2 mb-2 gap-2">
          <div>
            <SearchField
              value={searchKodeBridge}
              onChange={setSearchKodeBridge}
            />
          </div>
        </div>
        <Table
          data={searchKodeBridge ? filteredKodeBridge : formattedData}
          page={paginationInfo?.current_page - 1}
          totalPage={Math.ceil(paginationInfo?.total / rowsPerPage)}
          perPage={rowsPerPage}
          total={paginationInfo?.total}
          defaultPinned={{ column: "", position: "" }}
          listIconButton={[
            {
              name: "input",
              value: true,
              icon: <Icon icon="token:get" />,
              variant: "primary3",
              onClick: (row) => {
                setSelectedRow({
                  kode_bridge: row.kode_spesialis,
                  bridge_kode_bpjs: row.kode_poli,
                });
                onCloseDialog(false);
              },
            },
          ]}
          customWidths={{
            nama_poli: "min-w-[13rem]",
            nama_subspesialis: "min-w-[20rem]",
            kode_spesialis: "min-w-[15rem]",
            kode_poli: "min-w-[15rem]",
          }}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
};

export default DialogSpesialis;
