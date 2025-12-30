import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { searchPasien } from "@/api_disabled/registrasi/searchPasien";
import { useState } from "react";
import { Table } from "@/utils/table/table";
import useDialog from "@/hooks/ui/use-dialog";
import DatePicker from "@/utils/datePicker";
import { SkeletonTable } from "@/utils/skeletonLoader";
import { useFetchQuery } from "@/hooks/fetch/use-fetch-query";
import { useTabStore } from "@/stores/useTabStore";
import DialogInputIdAntrian from "../kunjungan_rajal/components/DialogInputIdAntrian";
import { STATUS_PASIEN } from "../ConstantsValue";

const mappedData = (data) =>
  data.map((item) => ({
    id_rm: item.id,
    no_rm: item.norm,
    nik: item.nik,
    nama_rm: item.fullname,
    status: (
      <span
        className={`block w-full p-2 ${
          item.status === true ? "bg-primary3" : "bg-stone-300"
        } rounded-md text-white text-center uppercase`}
      >
        {item.status === true ? "aktif" : "tidak aktif"}
      </span>
    ),
    jenis_kelamin: item.gender === 1 ? "Laki-laki" : "Perempuan",
    tanggal_lahir: item.date_ob,
    alamat: item.address_now,
    no_hp: item.mobile_phone_number,
    telepon: item.phone_number,
    occupation: item.occupation?.name,
    penanggung: item.guarantor_name,
    company_id: item.company_id?.id,
    insurance_id: item.insurance_id?.id,
    insurance_no: item.insurance_number,
    data_source: "rekam medis",
  }));

const DialogCariRekamMedis = ({ onSelectedRowChange, parentComponent }) => {
  const { register, control, handleSubmit } = useForm({
    defaultValues: { status: "true" },
  });

  const { open, close } = useDialog();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { openTab, setActiveTab } = useTabStore();

  const { data, isLoading } = useFetchQuery({
    queryKey: "rekam medis",
    apiFn: searchPasien,
    filters,
    page,
    perPage: rowsPerPage,
    mapFn: mappedData,
  });

  const onSubmit = async (formData) => {
    setFilters(formData);
    setPage(1);
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center bg-white p-4 space-y-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-evenly gap-4 pb-4">
          <div className="flex items-center">
            <div className="relative">
              <Input
                {...register("no_rm")}
                placeholder="ID RM"
                className="rounded-md"
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <Input
                {...register("nama")}
                placeholder="NAMA RM"
                className="rounded-md"
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <Input
                {...register("nik")}
                placeholder="NIK"
                className="rounded-md"
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <Input placeholder="INTERNAL" className="rounded-md" disabled />
            </div>
          </div>
          <div className="flex items-center">
            <div>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="relative flex items-center">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-full"
                        style={{ fontSize: 12 }}
                      >
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {STATUS_PASIEN.map((item) => (
                            <SelectItem key={item.key} value={item.value}>
                              {item.key}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            </div>
          </div>
          <div className="relative">
            <DatePicker
              name="tgl_lahir"
              control={control}
              placeholder="dd / mm / yyyy"
              triggerByIcon={true}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-end space-x-2">
          <Button
            type="button"
            variant="primary3"
            className="border border-primary1"
            disabled={true}
            onClick={() => {
              openTab("MM_PRM");
              setActiveTab("MM_PRM");
              close();
            }}
          >
            buat profil rekam medis baru
          </Button>
          <Button type="submit" variant="outlined">
            <Icon icon="mingcute:search-line" /> Cari
          </Button>
        </div>
      </form>
      <div className="w-[72vw]">
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <Table
            data={data?.items ?? []}
            page={page - 1}
            totalPage={data ? data.meta.last_page : 1}
            perPage={rowsPerPage}
            total={data ? data.meta.total : 0}
            defaultPinned={{ column: "id_rm", position: "left" }}
            pin={data?.items.length > 0}
            sort={data?.items.length > 0}
            border="border"
            header={[
              "id_rm",
              "nik",
              "nama_rm",
              "status",
              "jenis_kelamin",
              "tanggal_lahir",
              "alamat",
              "no_hp",
              "penanggung",
            ]}
            listIconButton={[
              {
                name: "input",
                value: true,
                icon: <Icon icon="token:get" />,
                variant: "primary3",
                onClick: (row) => {
                  onSelectedRowChange(
                    row
                  );
                  if (parentComponent === "rajal") {
                    open({
                      minWidth: "min-w-[50vw]",
                      contentTitle: "SCAN ATAU MASUKAN ID ANTRIAN",
                      component: DialogInputIdAntrian,
                    });
                  } else {
                    close();
                  }
                },
              },
            ]}
            customWidths={{
              no_rm: "min-w-[8rem]",
              nik: "min-w-[10rem]",
              nama_rm: "min-w-[10rem]",
              jenis_kelamin: "min-w-[12rem]",
              tanggal_lahir: "min-w-[12rem]",
              status: "min-w-[10rem]",
              alamat: "min-w-[12rem]",
              no_hp: "min-w-[8rem]",
              penanggung: "min-w-[12rem]",
            }}
            hiddenColumns={[
              "id_rm",
              "telepon",
              "occupation",
              "company_id",
              "insurance_id",
              "insurance_no",
              "data_source",
            ]}
            onPageChange={(newPage) => setPage(newPage + 1)}
            onRowsPerPageChange={(newPerPage) => {
              setRowsPerPage(newPerPage);
              setPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DialogCariRekamMedis;
