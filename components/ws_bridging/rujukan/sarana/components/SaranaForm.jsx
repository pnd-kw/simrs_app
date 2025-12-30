import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSaranaStore } from "@/stores/ws_bridging/useWsBridgingStore";
import Spinner from "@/utils/spinner";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { useState } from "react";

const SaranaForm = () => {
  const [searchForm, setSearchForm] = useState({
    kode_ppk_rujukan: "",
  });

  const {
    sarana,
    setRowsPerPage,
    setPage,
    setSearchQuery,
    isLoading,
    pagination,
    rowsPerPage,
  } = useSaranaStore();


  const mappedData = (data) =>
    data.map((item) => ({
      kode_sarana: item.kodeSarana || "-",
      nama_sarana: item.namaSarana || "-",
    }));

  const formattedData = mappedData(sarana);

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPage(1);
  };

  const onSearch = (formData) => {
    const query = new URLSearchParams();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        query.append(key, val);
      }
    });
    setSearchQuery(query.toString());
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner />
        </div>
      ) : (
        <div className="w-full h-screen p-4 mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch(searchForm);
              setPage(1);
            }}
          >
            <div className="flex p-4">
              <div className="grid w-full gap-2">
                <div>
                  <label className="text-xs uppercase">KODE PPK RUJUKAN</label>
                  <Input
                    type="text"
                    placeholder="KODE PPK RUJUKAN"
                    value={searchForm.kode_ppk_rujukan}
                    onChange={(e) =>
                      setSearchForm((prev) => ({
                        ...prev,
                        kode_ppk_rujukan: e.target.value,
                      }))
                    }
                    className="w-full px-2 py-1 border rounded-md min-h-[2vw]"
                  />
                </div>
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
                "kode_sarana",
                "nama_sarana",
              ]}
              customWidths={{
                kode_sarana: "min-w-[50rem]",
                nama_sarana: "min-w-[50rem]",
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

export default SaranaForm;
