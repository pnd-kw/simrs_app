import { getDokter } from "@/api/master/dokter";
import DynamicFormFields from "@/components/DynamicFormView";
import useDialog from "@/hooks/ui/use-dialog";
import {
  useListPoliklinikStore,
  useListSpesialisStore,
} from "@/stores/master/useMasterStore";
import { buildQueryString } from "@/utils/buildQueryString";
import { Table } from "@/utils/table/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../ui/button";
import {
  getDetailJadwalFieldsDialog,
  searchSchema,
} from "./JadwalDokterDialogFields";

const defaultFormValues = {
  fullname: "",
  id_ihs: "",
  poliklinik_id: null,
  spec_code: null,
  status: true,
};

const JadwalDokterDialogForm = ({ onSelectedRowChange }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: defaultFormValues,
  });

  const { listPoliklinik } = useListPoliklinikStore();
  const { listSpesialis, fetchListSpesialis } = useListSpesialisStore();

  const optionsLinkPoliklinik = listPoliklinik.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const optionsListSpesialis = listSpesialis.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const detailJadwalField = getDetailJadwalFieldsDialog(
    optionsLinkPoliklinik,
    optionsListSpesialis
  );

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
  // const [selectedRow, setSelectedRow] = useState({});

  const mappedData = (data) =>
    data.map((item) => ({
      id: item.id,
      nama: item.fullname || "-",
      spesialis: item.spec_code?.name || "-",
      inisial: item.inisial || "-",
    }));

  const fetchData = async (queryString) => {
    try {
      setIsLoading(true);
      const data = await getDokter(queryString);
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
    const selectedSpesialis = listSpesialis.find(
      (opt) => opt.id === formData.spec_code
    );
    const spec_code = selectedSpesialis?.spec_code ?? null;

    const finalData = {
      ...formData,
      spec_code: spec_code,
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

  useEffect(() => {
    fetchListSpesialis();
  }, []);

  return (
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
          header={[
            "nama",
            "spesialis",
          ]}
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
  );
};

export default JadwalDokterDialogForm;
