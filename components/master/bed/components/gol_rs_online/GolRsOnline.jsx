import {
  getKelasRsOnline,
  postKelasRsOnline,
  updateKelasRsOnline,
} from "@/api/master/bed";
import { FormModalZod } from "@/components/FormModalZod";
import { Button } from "@/components/ui/button";
import Spinner from "@/utils/spinner";
import SearchField from "@/utils/table/searchField";
import { Table } from "@/utils/table/table";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getGolRsOnlineFields, golRsOnlineSchema } from "./GolRsOnlineFields";

const GolRsOnline = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(golRsOnlineSchema),
    defaultValues: {
      kodebridgingsirs: "",
      name: "",
      remark: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formattedData, setFormattedData] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [searchGolRsOnline, setSearchGolRsOnline] = useState("");

  const fields = getGolRsOnlineFields();

  const mappedData = (data) =>
    data.map((item) => ({
      id: item.id,
      kode: item.kodebridgingsirs,
      nama: item.name,
      remark: item.remark || "-",
      inserted_time: item.createdAt,
      inserted_by: item.createdName || "-",
      updated_time: item.updatedAt,
      updated_by: item.updatedName || "-",
    }));

  const fetchData = async (query = "per_page=10") => {
    try {
      setIsLoading(true);
      const data = await getKelasRsOnline(query);

      setFormattedData(mappedData(data.data));
      setPaginationInfo({
        current_page: data.meta.current_page,
        total: data.meta.total,
        next_page_url: data.meta.next_page_url,
        prev_page_url: data.meta.prev_page_url,
        last_page: data.meta.last_page,
      });
    } catch (error) {
      console.error("Failed to fecth data", error);
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

  const onSubmit = async (data) => {
    try {
      if (selectedRow.id) {
        await updateKelasRsOnline({
          ...data,
          id: selectedRow.id,
        });
      } else {
        await postKelasRsOnline(data);
      }
      fetchData();
      reset();
      setSelectedRow({});

      toastWithProgress({
        title: "Berhasil",
        description: "Data Kelas RS Online berhasil disimpan.",
        type: "success",
      });

      setOpenModal(false);
    } catch (err) {
      console.error("Gagal simpan Kelas RS Online:", err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal simpan Kelas RS Online",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (openModal && !selectedRow?.id) {
      reset({
        kodebridgingsirs: "",
        name: "",
        remark: "",
      });
    }
  }, [openModal]);

  useEffect(() => {
    if (selectedRow?.id) {
      reset({
        id: selectedRow.id,
        kodebridgingsirs: selectedRow.kode,
        name: selectedRow.nama,
        remark: selectedRow.remark,
      });

      setOpenModal(true);
    }
  }, [selectedRow]);

  const filteredGolRsOnline = formattedData.filter((item) => {
    const searchLower = searchGolRsOnline.toLowerCase();
    return item.nama?.toLowerCase().includes(searchLower);
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner />
        </div>
      ) : (
        <div className="p-2 mx-auto w-full min-h-screen">
          <div className="flex justify-end p-2 mb-2 gap-2">
            <div>
              <SearchField
                value={searchGolRsOnline}
                onChange={setSearchGolRsOnline}
              />
            </div>
            <Button
              onClick={() => {
                setSelectedRow({});
                setOpenModal(true);
              }}
              className="px-4 py-2 bg-primary1 text-white rounded hover:bg-green-800 h-8"
            >
              Tambah
            </Button>
          </div>
          <Table
            data={searchGolRsOnline ? filteredGolRsOnline : formattedData}
            page={paginationInfo?.current_page - 1}
            totalPage={Math.ceil(paginationInfo?.total / rowsPerPage)}
            perPage={rowsPerPage}
            total={paginationInfo?.total}
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
                },
              },
            ]}
            hiddenColumns={["ruang_id", "remark"]}
            customWidths={{
              nama: "min-w-[20rem]",
              kode: "min-w-[15rem]",
              remark: "min-w-[15rem]",
              inserted_time: "min-w-[14rem]",
              inserted_by: "min-w-[14rem]",
              updated_time: "min-w-[14rem]",
              updated_by: "min-w-[14rem]",
            }}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
          <FormModalZod
            open={openModal}
            register={register}
            onClose={() => setOpenModal(false)}
            onSubmit={handleSubmit(onSubmit)}
            title={
              selectedRow?.id
                ? "Edit Kelas RS Online"
                : "Tambah Kelas RS Online"
            }
            fields={fields}
            errors={errors}
            control={control}
            submitLabel="Simpan"
          />
        </div>
      )}
    </>
  );
};

export default GolRsOnline;
