import { getListBooking } from "@/api_disabled/registrasi/booking";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { translateDay, sortSchedule } from "@/utils/schedule";
import { Table } from "@/utils/table/table";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import cleanReactElements from "@/utils/cleanReactElements";
import DatePicker from "@/utils/datePicker";
import { Button } from "@/components/ui/button";
import useScrollTopStore from "@/stores/useScrollTopStore";
import { SkeletonTable } from "@/utils/skeletonLoader";
import useBookingRs from "@/hooks/booking_antrian_kunjungan/use-booking-rs";
import { useFetchQuery } from "@/hooks/fetch/use-fetch-query";
import { useFetchScheduleDoctor } from "@/hooks/fetch/master_data/use-fetch-schedule-doctor";
import { useFetchAsuransi } from "@/hooks/fetch/master_data/use-fetch-asuransi";
import { useFetchDoctor } from "@/hooks/fetch/master_data/use-fetch-doctor";
import { getJadwalDokter } from "@/api_disabled/master/jadwalDokter";
import {
  ASAL_BOOKING,
  STATUS_BOOKING,
  STATUS_REGISTRASI,
  STATUS_RM,
} from "../../ConstantsValue";
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
    id_rm: item.rm_id,
    no_rm: `000${item.rm_id.toString()}`,
    status_booking: (
      <div className="flex w-full items-center justify-center">
        <span
          className={`w-24 p-2 ${
            item.status_booking === true ? "bg-primary3" : "bg-red1"
          } rounded-md text-white text-center uppercase`}
        >
          {item.status_booking === true ? "aktif" : "dibatalkan"}
        </span>
      </div>
    ),
    status_registrasi: (
      <span
        className={`block w-full p-2 ${
          item.isregistration === true ? "bg-primary3" : "bg-yellow1"
        } rounded-md text-white text-center uppercase`}
      >
        {item.isregistration === true ? "sudah registrasi" : "belum registrasi"}
      </span>
    ),
    status_rm: (
      <div className="flex w-full items-center justify-center">
        <span
          className={`w-20 p-2 ${
            item.status_rm === true ? "bg-primary3" : "bg-stone-300"
          } rounded-md text-white text-center uppercase`}
        >
          {item.status_rm === true ? "aktif" : "tidak Aktif"}
        </span>
      </div>
    ),
    tanggal_antrian: item.date,
    antrian: `${item.initial}-${item.antrianno}`,
    nik: item.nik,
    asal_booking: item.booking_from,
    asuransi: item.insurance_name,
    initial: item.initial,
    no_hp: item.mobile_phone,
    tlp: item.phone_number,
    dokter: item.doctor_name,
    catatan: item.remark,
    inserted_time: item.createdAt,
    inserted_by: item.createdName,
    updated_time: item.updatedAt,
    updated_by: item.updatedName,
    insurance_id: item.insurance_id,
    company_id: item.company_id,
    insurance_no: item.insurance_no,
    doctor_id: item.doctor_id,
    schedule_doctor_id: item.schedule_doctor_id,
    no_rujukan: item.norujukan,
    no_kontrol: item.nokontrol,
  }));

const SearchBookingAntrianKunjungan = () => {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      status_registrasi: "all",
      booking_from: "all",
      status_booking: "all",
      status_rm: "all",
    },
  });

  const { data: asuransi } = useFetchAsuransi();
  const { data: dokterList } = useFetchDoctor();

  const {
    setBookingRsData,
    isSuccessSubmitBookingRs,
    setIsSuccessSubmitBookingRs,
  } = useBookingRs();

  const doctorId = useWatch({ control, name: "doctor_id" });
  const { data: scheduleDoctor } = useFetchScheduleDoctor({
    queryKey: "jadwal dokter booking",
    apiFn: getJadwalDokter,
    params: { doctor_id: doctorId },
  });
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const stableFilters = useMemo(() => filters, [filters]); // Stabilkan filters agar tidak refetch terus menerus karena filters berbentuk object sehingga reference nya bisa berbeda walaupun isi nya sama

  const onSubmit = async (formData) => {
    setFilters(formData);
    setPage(1);
  };

  const { data, isFetching, isLoading } = useFetchQuery({
    queryKey: "booking",
    apiFn: getListBooking,
    filters: stableFilters,
    page,
    perPage: rowsPerPage,
    mapFn: mappedData,
  });

  const scrollToTop = useScrollTopStore((state) => state.scrollToTop);

  useEffect(() => {
    if (isSuccessSubmitBookingRs && !isFetching && data?.items?.length > 0) {
      setBookingRsData(data.items[0]);
      setIsSuccessSubmitBookingRs(false);
    }
  }, [isSuccessSubmitBookingRs, data]);

  return (
    <div className="w-full h-full px-4 py-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div
          className={`flex flex-col w-full min-h-[16vh] border-1 border-stone-400 rounded-bl-sm rounded-br-sm`}
        >
          <div className="flex w-full h-[24] bg-primary3 px-4 uppercase text-white text-sm">
            cari pasien
          </div>
          <div className="grid grid-cols-3 gap-2 px-2">
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="id_booking" className="label-style">
                    id booking
                  </label>
                </div>
                <div className="relative w-2/3">
                  <Input
                    {...register("id")}
                    placeholder="ID Booking"
                    className="rounded-sm"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="nama_pasien" className="label-style">
                    nama
                  </label>
                </div>
                <div className="relative w-2/3">
                  <Input
                    {...register("nama_pasien")}
                    placeholder="Nama"
                    className="rounded-sm"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="id" className="label-style">
                    tanggal
                  </label>
                </div>
                <div className="relative w-2/3">
                  <div className="flex h-full items-center">
                    <DatePicker
                      control={control}
                      name="tanggal_range"
                      placeholder="dd/mm/yyyy  s/d  dd/mm/yyyy"
                      mode="range"
                      numberOfMonths={1}
                      triggerByIcon={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 px-2">
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="doctor_id" className="label-style">
                    dokter
                  </label>
                </div>
                <div className="relative w-2/3">
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
                              <span className="max-w-50 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                {selected ? selected.name : "Pilih Dokter"}
                              </span>
                              <Icon
                                icon="dashicons:arrow-down"
                                className="size-5 text-stone-900 hover:text-stone-400"
                              />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[17vw] p-0">
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
                                <CommandEmpty>
                                  Dokter tidak ditemukan.
                                </CommandEmpty>
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
              </div>
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="schedule_doctor_id" className="label-style">
                    jadwal dokter
                  </label>
                </div>
                <div className="relative w-2/3">
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
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="insurance_id" className="label-style">
                    asuransi
                  </label>
                </div>
                <div className="relative w-2/3">
                  <Controller
                    name="insurance_id"
                    control={control}
                    render={({ field }) => {
                      const [open, setOpen] = useState(false);
                      const selected = asuransi?.find(
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
                              <span className="max-w-60 truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                {selected ? selected.name : "Pilih Asuransi"}
                              </span>
                              <Icon
                                icon="dashicons:arrow-down"
                                className="size-5 text-stone-900 hover:text-stone-400"
                              />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[19vw] p-0"
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
                              <CommandInput placeholder="Ketik nama asuransi..." />
                              <CommandList>
                                <CommandEmpty>
                                  Asuransi tidak ditemukan.
                                </CommandEmpty>
                                <CommandGroup>
                                  {asuransi?.map((item) => {
                                    return (
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
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 px-2">
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="status_booking" className="label-style">
                    status
                  </label>
                </div>
                <div className="relative w-2/3">
                  <Controller
                    name="status_booking"
                    control={control}
                    render={({ field }) => (
                      <div className="relative flex items-center">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                            <SelectValue placeholder="Status Booking" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {STATUS_BOOKING.map((item) => (
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
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="booking_from" className="label-style">
                    asal booking
                  </label>
                </div>
                <div className="relative w-2/3">
                  <Controller
                    name="booking_from"
                    control={control}
                    render={({ field }) => (
                      <div className="relative flex items-center">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                            <SelectValue placeholder="Asal Booking" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {ASAL_BOOKING.map((item) => (
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
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="status_rm" className="label-style">
                    status rm
                  </label>
                </div>
                <div className="relative w-2/3">
                  <Controller
                    name="status_rm"
                    control={control}
                    render={({ field }) => (
                      <div className="relative flex items-center">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                            <SelectValue placeholder="Status RM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {STATUS_RM.map((item) => (
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
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 px-2">
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <label htmlFor="status_registrasi" className="label-style">
                    status registrasi
                  </label>
                </div>
                <div className="relative w-2/3">
                  <Controller
                    name="status_registrasi"
                    control={control}
                    render={({ field }) => (
                      <div className="relative flex items-center">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                            <SelectValue placeholder="Status Registrasi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {STATUS_REGISTRASI.map((item) => (
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
            </div>
            <div className="grid grid-rows-3 max-h-[12vh]">
              <div className="flex items-center"></div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <Button
                    type="button"
                    variant="red1"
                    className="border-2 border-red2"
                    size="sm"
                    onClick={() => {
                      reset();
                    }}
                  >
                    <Icon icon="fluent:arrow-sync-12-filled" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full md:max-h-[10vh] items-center py-4">
          <div className="flex w-full gap-4 justify-end">
            <Button variant="lightBlue" className="capitalize">
              export list
            </Button>
            <Button variant="yellow1" className="text-stone-900">
              export
            </Button>
            <Button
              type="submit"
              variant="outlinedGreen2"
              className="capitalize"
            >
              <span>Search</span>
              <Icon icon="mingcute:search-line" />
            </Button>
          </div>
        </div>
      </form>
      <div className="w-full min-h-[90vh]">
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
            border="border"
            listIconButton={[
              {
                name: "edit",
                value: true,
                icon: <Icon icon="ic:round-edit" />,
                variant: "yellow2",
                onClick: (row) => {
                  const cleanedData = cleanReactElements(row);
                  setBookingRsData(cleanedData);
                  scrollToTop();
                },
              },
            ]}
            customWidths={{
              id_booking: "min-w-[10rem]",
              nama: "min-w-[12rem]",
              no_rm: "min-w-[9rem]",
              status_booking: "min-w-[12rem]",
              status_registrasi: "min-w-[13rem]",
              status_rm: "min-w-[10rem]",
              tanggal_antrian: "min-w-[13rem]",
              antrian: "min-w-[8rem]",
              asal_booking: "min-w-[11rem]",
              asuransi: "min-w-[9rem]",
              no_hp: "min-w-[8rem]",
              tlp: "min-w-[8rem]",
              dokter: "min-w-[12rem]",
              catatan: "min-w-[14rem]",
              inserted_time: "min-w-[11rem]",
              inserted_by: "min-w-[11rem]",
              updated_time: "min-w-[11rem]",
              updated_by: "min-w-[11rem]",
            }}
            hiddenColumns={[
              "id_rm",
              "insurance_id",
              "company_id",
              "insurance_no",
              "doctor_id",
              "schedule_doctor_id",
              "no_rujukan",
              "no_kontrol",
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

export default SearchBookingAntrianKunjungan;
