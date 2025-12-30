import {
  getPekerjaan,
  getPenaggungJawab,
  postPekerjaan,
  postPenaggungJawab,
  updatePekerjaan,
  updatePenaggungJawab,
} from "@/api/master/attribut";
import { FormModalZod } from "@/components/FormModalZod";
import { Table } from "@/utils/table/table";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getPekerjaanFields, pekerjaanSchema } from "./PenanggungJawabFields";
import Spinner from "@/utils/spinner";
import SearchField from "@/utils/table/searchField";
import { Button } from "@/components/ui/button";

const PekerjaanComp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(pekerjaanSchema),
    defaultValues: {
      name: "",
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
  const [searchPenanggungJawab, setSearchPenanggungJawab] = useState("");

  const fields = getPekerjaanFields();

  const mappedData = (data) =>
    data.map((item) => ({
      id: item.id,
      nama: item.name,
      remark: item.remark || "-",
      inserted_time: item.createdAt,
      inserted_by: item.createdName || "-",
      updated_time: item.updatedAt,
      updated_by: item.updatedName || "-",
    }));

  const fetchData = async (query = "") => {
    try {
      setIsLoading(true);
      const data = await getPenaggungJawab(query);

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
        await updatePenaggungJawab({
          ...data,
          id: selectedRow.id,
        });
      } else {
        await postPenaggungJawab(data);
      }
      fetchData();
      reset();
      setSelectedRow({});

      toastWithProgress({
        title: "Berhasil",
        description: "Data Pekerjaan berhasil disimpan.",
        type: "success",
      });

      setOpenModal(false);
    } catch (err) {
      console.error("Gagal simpan Pekerjaan:", err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal simpan Pekerjaan",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (openModal && !selectedRow?.id) {
      reset({
        name: "",
        remark: "",
      });
    }
  }, [openModal]);

  useEffect(() => {
    if (selectedRow?.id) {
      reset({
        id: selectedRow.id,
        name: selectedRow.nama,
        remark: selectedRow.remark,
      });

      setOpenModal(true);
    }
  }, [selectedRow]);

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPenanggungJawab = formattedData.filter((item) => {
    const searchLower = searchPenanggungJawab.toLowerCase();
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
                value={searchPenanggungJawab}
                onChange={setSearchPenanggungJawab}
              />
            </div>
            <Button
              onClick={() => {
                setSelectedRow({});
                reset({ name: "" });
                setOpenModal(true);
              }}
              className="px-4 py-2 bg-primary1 text-white rounded hover:bg-green-800 h-8"
            >
              Tambah
            </Button>
          </div>
          <Table
            data={
              searchPenanggungJawab ? filteredPenanggungJawab : formattedData
            }
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
              nama: "min-w-[20rem]",
              remark: "min-w-[15rem]",
              inserted_time: "min-w-[15rem]",
              inserted_by: "min-w-[15rem]",
              updated_time: "min-w-[15rem]",
              updated_by: "min-w-[14.5rem]",
            }}
            hiddenColumns={["id", "layanan_id"]}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
          <FormModalZod
            open={openModal}
            register={register}
            onClose={() => setOpenModal(false)}
            onSubmit={handleSubmit(onSubmit)}
            title={selectedRow?.id ? "Edit Pekerjaan" : "Tambah Pekerjaan"}
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

export default PekerjaanComp;
