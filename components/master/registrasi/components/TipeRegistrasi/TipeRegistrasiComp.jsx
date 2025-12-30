import { getTipeRegistrasi } from "@/api_disabled/master/registrasi";
import { postTextDisplay, updateTextDisplay } from "@/api_disabled/master/textDisplay";
import { FormModalZod } from "@/components/FormModalZod";
import { Table } from "@/utils/table/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getTipeRegistrasiFields,
  tipeRegistrasiSchema,
} from "./TextDisplayLoketFields";
import SearchField from "@/utils/table/searchField";
import { Button } from "@/components/ui/button";
import Spinner from "@/utils/spinner";

const TipeRegistrasiComp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(tipeRegistrasiSchema),
    defaultValues: {
      judul: "",
      kode: "",
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
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [searchTipeRegistrasi, setSearchTipeRegistrasi] = useState("");

  const mappedData = (data) =>
    data.map((item) => ({
      id: item.id,
      kode: item.code,
      judul: item.title,
      remark: item.text || "-",
      inserted_time: item.createdAt,
      inserted_by: item.createdName || "-",
      updated_time: item.updatedAt,
      updated_by: item.updatedName || "-",
    }));

  const fetchData = async (queryString) => {
    try {
      setIsLoading(true);
      const data = await getTipeRegistrasi(queryString);

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

  const onSubmit = async (data) => {
    try {
      if (selectedRow.id) {
        await updateTextDisplay({
          ...data,
          id: selectedRow.id,
        });
      } else {
        await postTextDisplay(data);
      }
      fetchData();
      reset();
      setSelectedRow({});

      toastWithProgress({
        title: "Berhasil",
        description: "Data Tipe Registrasi berhasil disimpan.",
        type: "success",
      });

      setOpenModal(false);
    } catch (err) {
      console.error("Gagal simpan Tipe Registrasi:", err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal simpan Tipe Registrasi",
        type: "error",
      });
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

  const fields = getTipeRegistrasiFields();

  useEffect(() => {
    if (selectedRow?.id) {
      reset({
        judul: selectedRow.judul || "",
        remark: selectedRow.remark || "",
        kode: selectedRow.kode || "",
      });
      setOpenModal(true);
    }
  }, [selectedRow]);

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTipeRegistrasi = formattedData.filter((item) => {
    const searchLower = searchTipeRegistrasi.toLowerCase();
    return item.judul?.toLowerCase().includes(searchLower);
  });

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner />
        </div>
      ) : (
        <div className="p-2 mx-auto">
          <div className="flex justify-end p-2 mb-2 gap-2">
            <div>
              <SearchField
                value={searchTipeRegistrasi}
                onChange={setSearchTipeRegistrasi}
              />
            </div>
            <Button
              onClick={() => {
                setSelectedRow({});
                reset({ judul: "", kode: "", remark: "" });
                setOpenModal(true);
              }}
              className="px-4 py-2 bg-primary1 text-white rounded hover:bg-green-800 h-8"
            >
              Tambah
            </Button>
          </div>
          <Table
            data={searchTipeRegistrasi ? filteredTipeRegistrasi : formattedData}
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
            customWidths={{
              judul: "min-w-[15rem]",
              remark: "min-w-[25.5rem]",
              kode: "min-w-[8rem]",
              inserted_time: "min-w-[12rem]",
              inserted_by: "min-w-[12rem]",
              updated_time: "min-w-[10rem]",
              updated_by: "min-w-[12rem]",
            }}
            hiddenColumns={["id"]}
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
                ? "Edit Tipe Registrasi"
                : "Tambah Tipe Registrasi"
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

export default TipeRegistrasiComp;
