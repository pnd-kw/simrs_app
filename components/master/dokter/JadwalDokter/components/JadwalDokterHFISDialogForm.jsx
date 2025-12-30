import { getJadwalDokterHFIS } from "@/api_disabled/master/jadwalDokter";
import DynamicFormFields from "@/components/DynamicFormView";
import useDialog from "@/hooks/ui/use-dialog";
import { useListPoliklinikStore } from "@/stores/master/useMasterStore";
import { buildQueryString } from "@/utils/buildQueryString";
import { Table } from "@/utils/table/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../ui/button";
import {
  getJadwalHFISFieldsDialog,
  searchHFISSchema,
} from "./JadwalDokterDialogFields";
import { todayString } from "@/utils/tanggal/formatDate";
import { SkeletonTable } from "@/utils/skeletonLoader";

const defaultFormValues = {
  kode_poli: null,
  tanggal: todayString,
};

const JadwalDokterHFISDialogForm = ({ onSelectedRowChange }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(searchHFISSchema),
    defaultValues: defaultFormValues,
  });
  const { listPoliklinik } = useListPoliklinikStore();
  const detailJadwalField = getJadwalHFISFieldsDialog(listPoliklinik);
  const { close } = useDialog();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formattedData, setFormattedData] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    current_page: 1,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    last_page: 1,
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const mappedData = (data) =>
    data.map((item) => ({
      id: item.id,
      hari: item.hari || "-",
      jadwal: item.jadwal || "-",
      kapasitaspasien: item.kapasitaspasien || "-",
      kodedokter: item.kodedokter || "-",
      kodepoli: item.kodepoli || "-",
      kodesubspesialis: item.kodesubspesialis || "-",
      libur: item.libur || "-",
      namadokter: item.namadokter || "-",
      namahari: item.namahari || "-",
      namapoli: item.namapoli || "-",
      namasubspesialis: item.namasubspesialis || "-",
    }));

  const fetchData = async (queryString) => {
    try {
      setIsLoading(true);
      const data = await getJadwalDokterHFIS(queryString);
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

  const onSubmit = async (formData) => {
    const selectedPoli = listPoliklinik.find(
      (opt) => opt.id === formData.kode_poli
    );
    const kodebridge = selectedPoli?.kodebridge ?? null;

    const finalData = {
      ...formData,
      kode_poli: kodebridge,
    };

    const queryString = buildQueryString(finalData);
    setSearchQuery(queryString);
    fetchData(queryString);
  };

  const handlePageChange = async (newPage) => {
    const newPageFixed = newPage + 1;
    const baseQuery = searchQuery
      ? `${searchQuery}&page=${newPageFixed}&per_page=${rowsPerPage}`
      : `page=${newPageFixed}&per_page=${rowsPerPage}`;
    setPaginationInfo((prev) => ({
      ...prev,
      current_page: newPageFixed,
    }));
    fetchData(baseQuery);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    setPaginationInfo((prev) => ({
      ...prev,
      current_page: 1,
    }));
    if (searchQuery) {
      const baseQuery = `${searchQuery}&per_page=${newPerPage}`;
      fetchData(baseQuery);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <SkeletonTable />
        </div>
      ) : (
        <div className="grid w-full h-full items-center justify-center bg-white p-4 space-y-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DynamicFormFields
              fields={detailJadwalField}
              control={control}
              errors={errors}
            />

            <div className="flex w-full items-center justify-end">
              <Button type="submit" variant="outlined">
                <Icon icon="mingcute:search-line" /> Cari
              </Button>
            </div>
          </form>

          <div className="w-[72vw]">
            <Table
              data={formattedData}
              page={paginationInfo?.current_page - 1}
              totalPage={Math.ceil(paginationInfo?.total / rowsPerPage)}
              perPage={rowsPerPage}
              total={paginationInfo?.total}
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
                    onSelectedRowChange(
                      formattedData.find((item) => item.row === row.row)
                    );
                    close();
                  },
                },
              ]}
              customWidths={{
                nama: "min-w-[30rem]",
                spesialis: "min-w-[49rem]",
              }}
              hiddenColumns={["id", "inisial"]}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default JadwalDokterHFISDialogForm;
