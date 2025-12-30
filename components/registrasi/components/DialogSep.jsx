import { getSepPeserta } from "@/api/registrasi/sep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFetchQuery } from "@/hooks/fetch/use-fetch-query";
import useDialog from "@/hooks/ui/use-dialog";
import DatePicker from "@/utils/datePicker";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import DialogProfilAndCreateSep from "./DialogProfilAndCreateSep";

const DialogSep = ({ insuranceNo, nikNumber, parentComponent }) => {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      tanggal_pelayanan: format(new Date(), "yyyy-MM-dd"),
      nomor: insuranceNo ?? nikNumber ?? 0,
      tipe: "0", // 0 untuk Nomor kartu BPJS, 1 untuk Nomor NIK
    },
  });

  const { open } = useDialog();
  const [filters, setFilters] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: sep, isFetching } = useFetchQuery({
    queryKey: "sep",
    apiFn: getSepPeserta,
    filters,
    enabled: !!filters,
    withPagination: false,
  });

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setFilters(formData);
  };

  useEffect(() => {
    if (!isFetching) {
      setIsSubmitting(false);
    }
  }, [isFetching]);

  useEffect(() => {
    if (sep && typeof sep === "object") {
      const prb = sep?.items?.peserta?.informasi?.prolanisPRB;
      const ppkPerujuk = sep?.items?.peserta?.provUmum?.nmProvider;
      open({
        minWidth: "min-w-[90vw]",
        contentTitle: "SEP",
        component: DialogProfilAndCreateSep,
        props: {
          prb,
          ppkPerujuk,
          parentComponent: parentComponent,
        },
      });
    }
  });

  return (
    <div className="flex-1 w-full h-full items-center p-2 bg-grey2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-1 w-full min-h-[25vh] items-center justify-center bg-white rounded-md p-4">
          <div className="flex flex-col bg-stone-50 rounded-sm p-4 space-y-2">
            <div className="flex w-full">
              <label
                htmlFor="tanggal_pelayanan"
                className="uppercase text-stone-500"
                style={{ fontSize: 10 }}
              >
                tanggal pelayanan
              </label>
            </div>
            <div className="flex w-full">
              <DatePicker
                control={control}
                name="tanggal_pelayanan"
                placeholder="dd/MM/yyyy"
                triggerByIcon={true}
              />
            </div>
            <div className="flex w-full">
              <label
                htmlFor="nomor"
                className="text-stone-500"
                style={{ fontSize: 10 }}
              >
                NIK/No BPJS
              </label>
            </div>
            <div className="flex w-full">
              <Input
                {...register("nomor")}
                placeholder="NIK/No BPJS"
                className="rounded-sm"
              />
            </div>
            <div className="flex w-full">
              <Controller
                control={control}
                name="tipe"
                render={({ field }) => (
                  <RadioGroup
                    value={String(field.value)}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <div className="flex w-full gap-6">
                      <div className="flex gap-1">
                        <RadioGroupItem value="0" id="bpjs" />
                        <label htmlFor="bpjs" className="label-style">
                          bpjs
                        </label>
                      </div>
                      <div className="flex gap-1">
                        <RadioGroupItem value="1" id="nik" />
                        <label htmlFor="nik" className="label-style">
                          nik
                        </label>
                      </div>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            <div className="flex w-full justify-end">
              <Button type="submit" variant="primary2" disabled={isSubmitting}>
                {isSubmitting ? "loading..." : "cari"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DialogSep;
