import {
  getPoliklinikSpesialis,
  postPoliklinikSpesialis,
  updatePoliklinikSpesialis,
} from "@/api_disabled/master/poliklinik";
import { FormModalZod } from "@/components/FormModalZod";
import { Button } from "@/components/ui/button";
import {
  useListPoliklinikStore,
  useListSpesialisStore,
} from "@/stores/master/useMasterStore";
import Spinner from "@/utils/spinner";
import SearchField from "@/utils/table/searchField";
import { Table } from "@/utils/table/table";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getPoliklinikSpesialisFields,
  poliklinikSpesialisSchema,
} from "./PoliklinikSpesialisFields";

const defaultFormValues = {
  poli_room_code: null,
  spec_code: null,
  remark: "",
};

const PoliklinikSpesialisComp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(poliklinikSpesialisSchema),
    defaultValues: defaultFormValues,
  });
  const { listPoliklinik, fetchListPoliklinik } = useListPoliklinikStore();
  const { listSpesialis, fetchListSpesialis } = useListSpesialisStore();

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
  const [searchKelasKunjungan, setSearchKelasKunjungan] = useState("");

  const mappedData = (data) =>
    data.map((item) => ({
      id: item.id,
      kode_kamar_poli: item.poli_room_code?.name,
      kode_spesialis: item.spec_code?.name,
      remark: item.remark || "-",
      inserted_time: item.createdAt,
      inserted_by: item.createdName || "-",
      updated_time: item.updatedAt,
      updated_by: item.updatedName || "-",
    }));

  const fetchData = async (queryString) => {
    try {
      setIsLoading(true);
      const data = await getPoliklinikSpesialis(queryString);

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

  const fields = getPoliklinikSpesialisFields(listPoliklinik, listSpesialis);

  useEffect(() => {
    if (selectedRow?.id) {
      setValue("poli_room_code", selectedRow.kode_kamar_poli);
      setValue("spec_code", selectedRow.kode_spesialis);
      setValue("remark", selectedRow.remark);
    }
  }, [selectedRow, setValue]);

  useEffect(() => {
    fetchData();
    fetchListPoliklinik();
    fetchListSpesialis();
  }, []);

  const onSubmit = async (data) => {
    try {
      const selectedPoli = listPoliklinik.find(
        (opt) => opt.id === data.poli_room_code
      );
      const selectedSpesialis = listSpesialis.find(
        (opt) => opt.id === data.spec_code
      );

      const poli_room_code = selectedPoli?.code ?? null;
      const spec_code = selectedSpesialis?.spec_code ?? null;

      const finalData = {
        ...data,
        poli_room_code,
        spec_code,
      };

      if (selectedRow.id) {
        await updatePoliklinikSpesialis({
          ...finalData,
          id: selectedRow.id,
        });
      } else {
        await postPoliklinikSpesialis(finalData);
      }

      fetchData();
      reset();

      toastWithProgress({
        title: "Berhasil",
        description: "Data berhasil disimpan.",
        type: "success",
      });

      setOpenModal(false);
    } catch (err) {
      console.error("Gagal simpan:", err);
      toastWithProgress({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data.",
        type: "error",
      });
    }
  };

  const filteredKelasKunjungan = formattedData.filter((item) => {
    const searchLower = searchKelasKunjungan.toLowerCase();
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
                value={searchKelasKunjungan}
                onChange={setSearchKelasKunjungan}
              />
            </div>
            <Button
              onClick={() => {
                setSelectedRow({});
                reset(defaultFormValues);
                setOpenModal(true);
              }}
              className="px-4 py-2 bg-primary1 text-white rounded hover:bg-green-800 h-8"
            >
              Tambah
            </Button>
          </div>
          <Table
            data={searchKelasKunjungan ? filteredKelasKunjungan : formattedData}
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
                  setOpenModal(true);
                },
              },
            ]}
            customWidths={{
              nama: "min-w-[20rem]",
              remark: "min-w-[20.5rem]",
              inserted_time: "min-w-[15rem]",
              inserted_by: "min-w-[15rem]",
              updated_time: "min-w-[12rem]",
              updated_by: "min-w-[12rem]",
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
            title={
              selectedRow?.id
                ? "Edit Text Display Loket"
                : "Tambah Text Display Loket"
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

export default PoliklinikSpesialisComp;
