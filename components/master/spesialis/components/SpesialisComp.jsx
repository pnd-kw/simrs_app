import { postSpesialis } from "@/api_disabled/master/spesialis";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import toastWithProgress from "@/utils/toast/toastWithProgress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import DialogSpesialis from "./DialogSpesialis";

const spesialisSchema = z.object({
  kode: z.string().min(1, "Kode wajib diisi"),
  nama: z.string().min(1, "Nama wajib diisi"),
  kode_bridge: z.string().min(1, "Pilih kode bridge terlebih dahulu!"),
});

const SpesialisComp = ({ selectedRow, setSelectedRow }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(spesialisSchema),
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");

  useEffect(() => {
    if (!selectedRow) return;

    if (selectedRow.bridge_kode_bpjs && !selectedRow.kode_subspesialis) {
      setValue("kode_bridge", selectedRow.bridge_kode_bpjs);
    }

    if (selectedRow.kode && selectedRow.name) {
      setValue("kode", selectedRow.kode);
      setValue("nama", selectedRow.name);
      setValue("kode_bridge", selectedRow.bridge_kode_bpjs || "");
    }
  }, [selectedRow, setValue]);

  const onSubmit = async (formValues) => {
    const payload = {
      name: formValues.nama,
      code: formValues.kode,
      codebridgepolibpjs: formValues.kode_bridge,
      codebridgesubspesialist: selectedRow?.kode_subspesialis || "",
      status: true,
    };

    try {
      await postSpesialis(payload);
      toastWithProgress({
        title: "Berhasil",
        description: "Data spesialis berhasil disimpan.",
        type: "success",
      });
      reset();
      setSelectedRow(null);
    } catch (err) {
      toastWithProgress({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan.",
        type: "error",
      });
    }
  };

  const labelStyle = "text-xs font-normal uppercase text-stone-900";
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid w-full h-full">
          <div className=" bg-white rounded-lg">
            <div className="grid grid-cols-2 gap-2 p-2 items-center text-xs">
              <div className="flex flex-col">
                <label htmlFor="rm_id" className={labelStyle}>
                  kode
                </label>
                <Input
                  {...register("kode")}
                  placeholder="Kode"
                  className="rounded-sm"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="rm_id" className={labelStyle}>
                  nama
                </label>
                <Input
                  {...register("nama")}
                  placeholder="Nama"
                  className="rounded-sm"
                />
              </div>
              <div className="grid col-span-2">
                <label htmlFor="rm_id" className={labelStyle}>
                  bridge poli bpjs
                </label>
                <div className="relative">
                  <Input
                    {...register("kode_bridge")}
                    placeholder="Pilih Kode Bridge"
                    disabled
                    className="rounded-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                    onClick={() => {
                      setIsDialogOpen(true);
                      setDialogTitle("Bridge");
                    }}
                  >
                    <Icon
                      icon="mingcute:search-line"
                      className="text-[#06562d]"
                    />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between col-span-2 mt-4">
                <div>
                  <Button
                    className="rounded-sm min-h-[2rem] min-w-[4rem]"
                    variant="destructive"
                    type="button"
                    onClick={() => {
                      reset();
                    }}
                  >
                    Reset
                  </Button>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="rounded-sm min-h-[2rem] min-w-[4rem]"
                    variant="primary2"
                  >
                    Simpan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => setIsDialogOpen(open)}
      >
        <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle></DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden>
            <DialogDescription>
              Booking antrian kunjungan dialog
            </DialogDescription>
          </VisuallyHidden>
          <div className="flex items-center pl-10 bg-[#0C5535] w-full h-[10vh] text-white font-semibold">
            {dialogTitle}
          </div>
          <DialogSpesialis
            setSelectedRow={setSelectedRow}
            onCloseDialog={setIsDialogOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpesialisComp;
