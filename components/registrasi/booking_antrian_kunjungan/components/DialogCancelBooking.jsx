import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { cancelBooking } from "@/api_disabled/registrasi/booking";
import { useUpdate } from "@/hooks/mutation/use-update";
import { Button } from "@/components/ui/button";

const DialogCancelBooking = ({ idBooking }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: { keterangan: "-" },
  });

  const { mutate } = useUpdate({
    apiFn: cancelBooking,
    queryKey: "booking",
    successMessage: "Berhasil membatalkan booking antrian kunjungan.",
    errorMessage: "Gagal membatalkan booking antrian kunjungan.",
  });

  const onSubmit = async (data) => {
    if (!idBooking) return;

    const payload = { ...data, id: idBooking.toString() };

    mutate(payload);
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
            <Button type="submit" variant="red2" size="sm">
              cancel booking
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DialogCancelBooking;
