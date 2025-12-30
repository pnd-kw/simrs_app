import ReusableComboboxZod from "@/components/ReusableComboboxZod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBedStore } from "@/stores/master/useMasterStore";
import useScrollTopStore from "@/stores/useScrollTopStore";
import Spinner from "@/utils/spinner";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const SearchMasterBed = () => {
  const [searchForm, setSearchForm] = useState({
    id: "",
    name: "",
    kelas_id: "",
    kamar_id: "",
    ruang_aplicares: "",
    status: "",
  });
  const scrollToTop = useScrollTopStore((state) => state.scrollToTop);

  const {
    beds,
    dropdown,
    pagination,
    rowsPerPage,
    fetchBeds,
    setSelectedRow,
    setRowsPerPage,
    setPage,
    setSearchQuery,
    isLoading,
  } = useBedStore();

  const mappedData = (data) =>
    data.map((item) => ({
      id: item.id,
      kelas_id: item.kelas_id?.id || null,
      kelaskamarsirsonline: item.kelaskamarsirsonline?.id || null,
      gol_golongankelasaplicares: item.gol_golongankelasaplicares?.id || null,
      ruang_aplicares: item.ruang_aplicares?.kode || null,
      kamar_id: item.kamar_id?.id || null,
      jenis_layanan_id: item.jenis_layanan_id?.id || null,

      nama: item.name,
      ruang_aplicare: item.ruang_aplicares?.name || "-",
      kelas_kamar: item.kelas_id?.name || "-",
      ruang: item.name?.split(" ")[0] || "-",
      gol_kelas_aplicares: item.gol_golongankelasaplicares?.name || "-",
      kamar: item.kamar_id?.name || "-",
      kelas_kamar_sirs_online: item.kelaskamarsirsonline?.name || "-",
      status: (
        <span
          className={`block w-full p-2 ${
            item.status === 1 ? "bg-primary3" : "bg-stone-300"
          } rounded-md text-white text-center uppercase`}
        >
          {item.status === 1 ? "aktif" : "tidak aktif"}
        </span>
      ),
      inserted_time: item.createdAt,
      inserted_by: item.createdName || "-",
      updated_time: item.updatedAt,
      updated_by: item.updatedName || "-",
    }));

  const formattedData = mappedData(beds);

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

  const resetSearchForm = () => {
    setSearchForm({
      id: "",
      name: "",
      kelas_id: "",
      kamar_id: "",
      ruang_aplicares: "",
      status: "",
    });
    setSearchQuery("");
    fetchBeds();
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner />
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
              <div className="grid grid-cols-4 w-full gap-2">
                <div>
                  <label className="text-xs uppercase">id</label>
                  <Input
                    type="text"
                    placeholder="ID"
                    value={searchForm.id}
                    onChange={(e) =>
                      setSearchForm((prev) => ({ ...prev, id: e.target.value }))
                    }
                    className="w-full px-2 py-1 border rounded-md min-h-[2vw]"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase">Nama Tempat Tidur</label>
                  <Input
                    type="text"
                    placeholder="Nama"
                    value={searchForm.name}
                    onChange={(e) =>
                      setSearchForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-2 py-1 border rounded-md min-h-[2vw]"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase">kelas kamar</label>
                  <ReusableComboboxZod
                    value={searchForm.kelas_id}
                    placeholder="Pilih Kelas Kamar"
                    onChange={(val) =>
                      setSearchForm((prev) => ({ ...prev, kelas_id: val }))
                    }
                    options={[...dropdown.kelasKamar]}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase">kamar</label>
                  <ReusableComboboxZod
                    value={searchForm.kamar_id}
                    placeholder="Pilih Kamar"
                    onChange={(val) =>
                      setSearchForm((prev) => ({ ...prev, kamar_id: val }))
                    }
                    options={[...dropdown.kamar]}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase">ruang aplicares</label>
                  <ReusableComboboxZod
                    value={searchForm.ruang_aplicares}
                    placeholder="Pilih Ruang Aplicares"
                    onChange={(val) =>
                      setSearchForm((prev) => ({
                        ...prev,
                        ruang_aplicares: val,
                      }))
                    }
                    options={[...dropdown.ruangAplicares]}
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
                {
                  name: "delete",
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
                remark: "min-w-[10rem]",
              }}
              hiddenColumns={[
                "kelas_id",
                "kelaskamarsirsonline",
                "gol_golongankelasaplicares",
                "ruang_aplicares",
                "kamar_id",
                "jenis_layanan_id",
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

export default SearchMasterBed;
