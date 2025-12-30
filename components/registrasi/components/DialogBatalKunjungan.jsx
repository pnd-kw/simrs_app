import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";

import useDialog from "@/hooks/ui/use-dialog";
import { useCreate } from "@/hooks/mutation/use-create";
import { batalKunjungan } from "@/api/registrasi/bukaTutupBatalKunjungan";

const DialogBatalKunjungan = ({ idKunjungan }) => {
  const { close } = useDialog();
  const { register, handleSubmit } = useForm({
    defaultValues: { keterangan: "-" },
  });

  const { mutate } = useCreate({
    apiFn: batalKunjungan,
    queryKey: "kunjungan rajal",
    successMessage: "Berhasil membatalkan kunjungan rawat jalan.",
    errorMessage: "Gagal membatalkan kunjungan rawat jalan.",
  });

  const onSubmit = async (data) => {
    if (Object.keys(data).length === 0) return;

    const payload = { ...data, id: idKunjungan };

    mutate(payload, {
      onSuccess: (data) => {
        if (data?.data?.message === "Sukses") {
          close();
        }
      },
    });
  };

  return (
    <div className="flex w-full h-full items-center justify-center py-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full">
        <div className="w-full pl-4 pr-4">
          <label
            htmlFor="keterangan"
            className="text-xs font-normal capitalize text-stone-900"
          >
            Alasan
          </label>
          <Textarea
            {...register("keterangan")}
            className="flex w-full min-h-36 shadow-md"
          />
          <div className="flex w-full justify-end pt-6 pb-2">
            <Button type="submit" variant="primary3" size="sm">
              simpan
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DialogBatalKunjungan;
