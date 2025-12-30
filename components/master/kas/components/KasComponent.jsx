import { getCoa, getKas, simpanKas, updateKas } from "@/api_disabled/master/kas";
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
import { getKasCheckboxes, getKasFields, kasSchema } from "./KasFormFields";

const KasComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(kasSchema),
    defaultValues: {
      nama: "",
      id_coa: null,
      jumlah: "",
      no_rek: "",
      telepon: "",
      no_hp: "",
      no_contact_person: "",
      remark: "Kamar untuk pasien umum",
      is_bayar_saldo: true,
      is_penjualan: true,
      is_bayar_tagihan: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [listCoa, setListCoa] = useState([]);
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
  const [searchKas, setSearchKas] = useState("");

  const mappedData = (data) =>
    data.map((item) => ({
      id: item.id,
      nama: item.nama,
      coa: item.id_coa?.name || "-",
      code_coa: item.id_coa?.code || "-",
      jumlah: item.jumlah,
      no_rek: item.no_rek,
      no_hp: item.no_hp,
      telephone: item.telepon,
      no_contact_person: item.no_contact_person,
      pembayaran_saldo: item.is_bayar_saldo ? "Ya" : "Tidak",
      input_penjualan: item.is_penjualan ? "Ya" : "Tidak",
      pembayaran_tagihan: item.is_bayar_tagihan ? "Ya" : "Tidak",
      inserted_time: item.createdAt,
      inserted_by: item.createdName,
      updated_time: item.updatedAt,
      updated_by: item.updatedName || "-",
    }));

  const fetchData = async (query = "per_page=10") => {
    try {
      setIsLoading(true);
      const data = await getKas(query);

      setFormattedData(mappedData(data.data));
      setPaginationInfo({
        current_page: data.meta.curent_page,
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
        await updateKas({
          ...data,
          id: selectedRow.id,
        });
      } else {
        await simpanKas(data);
      }

      fetchData();
      reset();
      setSelectedRow({});

      toastWithProgress({
        title: "Berhasil",
        description: "Data kas berhasil disimpan.",
        type: "success",
      });

      setOpenModal(false);
    } catch (err) {
      console.error("Gagal simpan kas:", err);
      toastWithProgress({
        title: "Gagal",
        description: "Gagal simpan kas",
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

  const fields = getKasFields(listCoa);
  const checkboxes = getKasCheckboxes();

  useEffect(() => {
    const fetchCoa = async () => {
      try {
        const res = await getCoa();
        const options = res.data.map((item) => ({
          label: `${item.name} - ${item.code}`,
          value: item.code,
        }));
        setListCoa(options);
      } catch (err) {
        console.error("Gagal fetch COA:", err);
      }
    };

    fetchCoa();
  }, []);

  useEffect(() => {
    if (selectedRow?.id) {
      reset({
        nama: selectedRow.nama,
        id_coa: selectedRow.code_coa,
        jumlah: selectedRow.jumlah,
        no_rek: selectedRow.no_rek,
        telepon: selectedRow.telephone,
        no_hp: selectedRow.no_hp,
        no_contact_person: selectedRow.no_contact_person,
        is_bayar_saldo: selectedRow.pembayaran_saldo === "Ya",
        is_penjualan: selectedRow.input_penjualan === "Ya",
        is_bayar_tagihan: selectedRow.pembayaran_tagihan === "Ya",
      });
      setOpenModal(true);
    }
  }, [selectedRow]);

  useEffect(() => {
    fetchData();
  }, []);

  const filteredKas = formattedData.filter((item) => {
    const searchLower = searchKas.toLowerCase();
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
              <SearchField value={searchKas} onChange={setSearchKas} />
            </div>
            <Button
              onClick={() => {
                setSelectedRow({});
                reset({
                  nama: "",
                  id_coa: null,
                  jumlah: "",
                  no_rek: "",
                  telepon: "",
                  no_hp: "",
                  no_contact_person: "",
                  remark: "Kamar untuk pasien umum",
                  is_bayar_saldo: true,
                  is_penjualan: true,
                  is_bayar_tagihan: true,
                });
                setOpenModal(true);
              }}
              className="px-4 py-2 bg-primary1 text-white rounded hover:bg-green-800 h-8"
            >
              Tambah
            </Button>
          </div>
          <Table
            data={searchKas ? filteredKas : formattedData}
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
            onPageChange={handlePageChange}
            hiddenColumns={["id", "code_coa", "telepone", "no_contact_person"]}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
          <FormModalZod
            open={openModal}
            register={register}
            onClose={() => setOpenModal(false)}
            onSubmit={handleSubmit(onSubmit)}
            title={selectedRow?.id ? "Edit Kas" : "Tambah Kas"}
            fields={fields}
            errors={errors}
            checkboxes={checkboxes}
            control={control}
            submitLabel="Simpan"
          />
        </div>
      )}
    </>
  );
};

export default KasComponent;
