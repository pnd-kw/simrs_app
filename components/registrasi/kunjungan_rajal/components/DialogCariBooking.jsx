import { getJadwalDokter } from "@/api_disabled/master/jadwalDokter";
import { getListBooking } from "@/api_disabled/registrasi/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchDoctor } from "@/hooks/fetch/master_data/use-fetch-doctor";
import { useFetchScheduleDoctor } from "@/hooks/fetch/master_data/use-fetch-schedule-doctor";
import { useFetchQuery } from "@/hooks/fetch/use-fetch-query";
import useDialog from "@/hooks/ui/use-dialog";
import DatePicker from "@/utils/datePicker";
import { sortSchedule, translateDay } from "@/utils/schedule";
import { SkeletonTable } from "@/utils/skeletonLoader";
import { Table } from "@/utils/table/table";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import DialogInputIdAntrian from "./DialogInputIdAntrian";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const mappedData = (data) =>
  data.map((item) => ({
    id_booking: item.id,
    nama: item.name,
    no_rm: item.rm_id, // Sebelumnya id_rm
    doctor_id: item.doctor_id,
    schedule_doctor_id: item.schedule_doctor_id,
    dokter: item.doctor_name,
    jadwal_praktek: (
      <div>
        {`${translateDay(item.doctor_schedule_day)}, ${
          item.doctor_schedule_time_start
        } - ${item.doctor_schedule_time_finish}`}{" "}
        (Praktek)
      </div>
    ),
    poliklinik_id: item.doctor_poliklinik_id,
    no_hp: item.mobile_phone,
    nik: item.nik,
    jenis_kelamin: item.rm_gender === 1 ? "Laki-laki" : "Perempuan",
    no_hp: item.rm_no_hp,
    telepon: item.phone_number,
    alamat: item.rm_address_now,
    occupation: item.rm_occupation,
    penanggung: item.rm_guarantor_name,
    company_id: item.company_id,
    initial: item.initial,
    no_antrian: item.antrianno,
    insurance_id: item.insurance_id,
    insurance_no: item.insurance_no,
    inserted_time: item.createdAt,
    inserted_by: item.createdName,
    updated_time: item.updatedAt,
    updated_by: item.updatedName,
    data_source: "booking",
  }));

const DialogCariBooking = ({ onSelectedRowChange }) => {
  const { open } = useDialog();
  const today = format(new Date(), "yyyy-MM-dd");
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { register, control, setValue, handleSubmit } = useForm({
    defaultValues: {
      tanggal_mulai: today,
    },
  });

  const { data: dokterList } = useFetchDoctor();
  const doctorId = useWatch({ control, name: "doctor_id" });
  const { data: scheduleDoctor } = useFetchScheduleDoctor({
    queryKey: "jadwal dokter booking",
    apiFn: getJadwalDokter,
    params: { doctor_id: doctorId },
  });

  const { data, isLoading } = useFetchQuery({
    queryKey: "booking",
    apiFn: getListBooking,
    filters,
    page,
    perPage: rowsPerPage,
    mapFn: mappedData,
  });

  const onSubmit = (formData) => {
    const params = {
      ...formData,
      tanggal_mulai: format(new Date(formData.tanggal_mulai), "yyyy-MM-dd"),
      tanggal_selesai: today,
    };
    setFilters(params);
    setPage(1);
  };

  return (
    <div className="flex flex-col w-full h-full justify-center bg-white p-4 space-y-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-evenly gap-4 pb-4">
          <div className="flex-1 flex-col items-center">
            <label htmlFor="id_booking" className="text-white uppercase">
              id booking
            </label>
            <Input
              {...register("id")}
              placeholder="ID BOOKING"
              className="rounded-md"
            />
          </div>
          <div className="flex-1 flex-col items-center">
            <label htmlFor="nama" className="text-white uppercase">
              nama
            </label>
            <Input
              {...register("nama_pasien")}
              placeholder="Nama"
              className="rounded-md"
            />
          </div>
          <div className="flex-1 flex-col items-center">
            <div className="flex w-full justify-end">
              <Button
                type="button"
                variant="text"
                size="text"
                onClick={() => setValue("date", new Date())}
                style={{ fontSize: 9 }}
              >
                Today
              </Button>
            </div>
            <DatePicker
              name="tanggal_mulai"
              control={control}
              placeholder="dd / mm / yyyy"
              triggerByIcon={false}
            />
          </div>
          <div className="flex-2 flex-col items-center">
            <label htmlFor="doctor_id" className="text-white uppercase">
              dokter
            </label>
            <Controller
              name="doctor_id"
              control={control}
              render={({ field }) => {
                const [open, setOpen] = useState(false);
                const selected = dokterList?.find(
                  (item) => item.id === field.value
                );

                return (
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full max-h-[5vh] rounded-md border border-stone-400 justify-between"
                        style={{ fontSize: 12 }}
                      >
                        {selected ? selected.name : "Pilih Dokter"}
                        <Icon
                          icon="dashicons:arrow-down"
                          className="size-5 text-stone-900 hover:text-stone-400"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[23vw] p-0"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <Command
                        filter={(value, search) => {
                          return value
                            .toLowerCase()
                            .includes(search.toLowerCase())
                            ? 1
                            : 0;
                        }}
                      >
                        <CommandInput placeholder="Ketik nama dokter..." />
                        <CommandList>
                          <CommandEmpty>Dokter tidak ditemukan.</CommandEmpty>
                          <CommandGroup>
                            {dokterList?.map((item) => (
                              <CommandItem
                                key={item.id}
                                value={item.name}
                                onSelect={() => {
                                  field.onChange(item.id);
                                  setOpen(false);
                                }}
                                className={`${
                                  item.id === field.value
                                    ? "!bg-primary3 !text-white"
                                    : "aria-selected:!bg-primary3 aria-selected:!text-white"
                                } text-xs justify-between`}
                              >
                                {item.name}
                                <Icon
                                  icon="ic:baseline-check"
                                  className={`${
                                    item.id === field.value
                                      ? "opacity-100 text-white"
                                      : "opacity-0"
                                  }`}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
          </div>
          <div className="flex-1 flex-col items-center">
            <label
              htmlFor="schedule_doctor_id"
              className="text-white uppercase"
            >
              schedule dokter
            </label>
            <Controller
              name="schedule_doctor_id"
              control={control}
              render={({ field }) => {
                const selected = scheduleDoctor?.find(
                  (item) => item.id === field.value
                );
                return (
                  <div className="relative flex items-center">
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger
                        className="w-full"
                        style={{ fontSize: 12 }}
                        icon={
                          <Icon
                            icon="dashicons:arrow-down"
                            className="size-5 text-stone-900 hover:text-stone-400"
                          />
                        }
                      >
                        <SelectValue placeholder="Pilih">
                          {selected
                            ? `${translateDay(selected.day)} ${
                                selected.start
                              } - ${selected.finish}`
                            : "Pilih"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {!doctorId ? (
                            <SelectItem value="no-doctor" disabled>
                              Pilih dokter terlebih dahulu
                            </SelectItem>
                          ) : (
                            sortSchedule(scheduleDoctor)?.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {translateDay(item.day)} {item.start} -
                                {item.finish}
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                );
              }}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-end space-x-2">
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
            defaultPinned={{ column: "id_booking", position: "left" }}
            pin={data?.items.length > 0}
            sort={data?.items.length > 0}
            border="border"
            header={[
              "id_booking",
              "nama",
              "id_rm",
              "dokter",
              "jadwal_praktek",
              "no_hp",
              "nik",
              "inserted_time",
              "inserted_by",
              "updated_time",
              "updated_by",
            ]}
            listIconButton={[
              {
                name: "input",
                value: true,
                icon: <Icon icon="token:get" />,
                variant: "primary3",
                onClick: (row) => {
                  onSelectedRowChange(row);
                  open({
                    minWidth: "min-w-[50vw]",
                    contentTitle: "SCAN ATAU MASUKAN ID ANTRIAN",
                    component: DialogInputIdAntrian,
                  });
                },
              },
            ]}
            customWidths={{
              id_booking: "min-w-[8rem]",
              nama: "min-w-[10rem]",
              id_rm: "min-w-[10rem]",
              dokter: "min-w-[12rem]",
              jadwal_praktek: "min-w-[12rem]",
              no_hp: "min-w-[10rem]",
              nik: "min-w-[12rem]",
              inserted_time: "min-w-[8rem]",
              inserted_by: "min-w-[12rem]",
              updated_time: "min-w-[12rem]",
              updated_by: "min-w-[10rem]",
            }}
            hiddenColumns={[
              "doctor_id",
              "jenis_kelamin",
              "no_hp",
              "telepon",
              "alamat",
              "occupation",
              "penanggung",
              "company_id",
              "insurance_id",
              "insurance_no",
              "initial",
              "no_antrian",
              "poliklinik",
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

export default DialogCariBooking;
