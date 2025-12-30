import {
  getJenisRawat,
  postJenisRawat,
  updateJenisRawat,
} from "@/api_disabled/master/layanan";
import { FormModalZod } from "@/components/FormModalZod";
import { Table } from "@/utils/table/table";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getJenisRawatFields, JenisRawatSchema } from "./JenisRawatFields";
import SearchField from "@/utils/table/searchField";
import { Button } from "@headlessui/react";
import Spinner from "@/utils/spinner";

const JenisRawatComp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(JenisRawatSchema),
    defaultValues: {
      name: "",
      code: "",
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
  const [searchJenisRawat, setSearchJenisRawat] = useState("");

  const mappedData = (data) =>
    data.map((item) => ({
      id: item.id,
      kode: item.code || "-",
      nama: item.name,
      inserted_time: item.createdAt,
      inserted_by: item.createdName || "-",
      updated_time: item.updatedAt,
      updated_by: item.updatedName || "-",
    }));

  const fetchData = async (queryString = "") => {
    try {
      setIsLoading(true);
      const data = await getJenisRawat(queryString);

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

  const fields = getJenisRawatFields();

  useEffect(() => {
    if (selectedRow?.id) {
      reset({
        id: selectedRow.id,
        name: selectedRow.nama,
        code: selectedRow.kode,
      });

      setOpenModal(true);
    }
  }, [selectedRow]);

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (selectedRow.id) {
        await updateJenisRawat({
          ...data,
          id: selectedRow.id,
        });
      } else {
        await postJenisRawat(data);
      }
      fetchData();
      reset();

      toastWithProgress({
        title: "Berhasil",
        description: "Data Jenis Rawat berhasil disimpan.",
        type: "success",
      });

      setOpenModal(false);
    } catch (err) {
      console.error("Gagal simpan Jenis Rawat:", err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal simpan Jenis Rawat",
        type: "error",
      });
    }
  };

  const filteredJenisRawat = formattedData.filter((item) => {
    const searchLower = searchJenisRawat.toLowerCase();
    return item.nama?.toLowerCase().includes(searchLower);
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
                value={searchJenisRawat}
                onChange={setSearchJenisRawat}
              />
            </div>
            <Button
              onClick={() => {
                setSelectedRow({});
                reset({ name: "", code: "" });
                setOpenModal(true);
              }}
              className="px-2 bg-primary1 text-white rounded hover:bg-green-800 h-8"
            >
              Tambah
            </Button>
          </div>
          <Table
            data={searchJenisRawat ? filteredJenisRawat : formattedData}
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
              kode: "min-w-[15rem]",
              nama: "min-w-[20rem]",
              inserted_time: "min-w-[14.5rem]",
              inserted_by: "min-w-[15rem]",
              updated_time: "min-w-[15rem]",
              updated_by: "min-w-[15rem]",
            }}
            hiddenColumns={["id", "tarif_id"]}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
          <FormModalZod
            open={openModal}
            register={register}
            onClose={() => setOpenModal(false)}
            onSubmit={handleSubmit(onSubmit)}
            title={selectedRow?.id ? "Edit Jenis Rawat" : "Tambah Jenis Rawat"}
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

export default JenisRawatComp;
