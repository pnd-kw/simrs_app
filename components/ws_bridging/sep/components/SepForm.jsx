import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useWsSEPStore } from "@/stores/ws_bridging/useWsBridgingStore";
import Spinner from "@/utils/spinner";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { useState } from "react";

const SepForm = () => {
  const [searchForm, setSearchForm] = useState({
    no_sep: "",
  });

  const {
    wsSep,
    setRowsPerPage,
    setPage,
    setSearchQuery,
    isLoading,
    pagination,
    rowsPerPage,
  } = useWsSEPStore();

  const formattedData = [
    {
      no_rm: wsSep.peserta?.noMr || null,
      nama_pasien: wsSep.peserta?.nama || null,
      tanggal_lahir: wsSep.peserta?.tglLahir || null,
      no_sep: wsSep.noSep || null,
      no_rujukan: wsSep.noRujukan || null,
      pelayanan: wsSep.jnsPelayanan || null,
      tgl_sep: wsSep.tglSep || null,
    },
  ];

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
                  <label className="text-xs uppercase">NO. SEP PESERTA</label>
                  <Input
                    type="text"
                    placeholder="NO. SEP PESERTA"
                    value={searchForm.no_sep}
                    onChange={(e) =>
                      setSearchForm((prev) => ({
                        ...prev,
                        no_sep: e.target.value,
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
                "no_rm",
                "nama_pasien",
                "tanggal_lahir",
                "no_sep",
                "no_rujukan",
                "pelayanan",
                "tgl_sep",
              ]}
              customWidths={{
                no_rm: "min-w-[10rem]",
                nama_pasien: "min-w-[15rem]",
                tanggal_lahir: "min-w-[15rem]",
                no_sep: "min-w-[15rem]",
                no_rujukan: "min-w-[15rem]",
                pelayanan: "min-w-[10rem]",
                tgl_sep: "min-w-[15rem]",
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

export default SepForm;
