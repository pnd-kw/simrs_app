import DatePicker from "@/utils/datePicker";
import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import useDialog from "@/hooks/ui/use-dialog";
import { useCreate } from "@/hooks/mutation/use-create";
import { tutupKunjungan } from "@/api_disabled/registrasi/bukaTutupBatalKunjungan";

const DialogTutupKunjungan = ({ idKunjungan, setIsKunjunganTertutup }) => {
  const { close } = useDialog();

  const { control, handleSubmit } = useForm({
    defaultValues: { tanggal_selesai: new Date() },
  });

  const { mutate } = useCreate({
    apiFn: tutupKunjungan,
    queryKey: "kunjungan rajal",
    successMessage: "Berhasil menutup kunjungan.",
    errorMessage: "Gagal menutup kunjungan.",
  });

  const onSubmit = async (data) => {
    if (Object.keys(data).length === 0) return;

    const payload = {
      ...data,
      id: idKunjungan,
      tanggal_selesai: new Date(data.tanggal_selesai).toISOString(),
    };

    mutate(payload, {
      onSuccess: (data) => {
        if (data?.data?.message === "Sukses") {
          close();
          setIsKunjunganTertutup(true);
        }
      },
    });
  };

  return (
    <div className="w-full h-full p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col w-full pb-2">
          <label htmlFor="tanggal_selesai" className="label-style">
            tanggal
          </label>
          <DatePicker
            control={control}
            name="tanggal_selesai"
            placeholder="Tanggal"
            triggerByIcon={true}
            showTime={true}
          />
        </div>
        <div className="flex w-full min-h-[6vh] items-center justify-end">
          <Button type="submit" variant="primary3" className="capitalize">
            simpan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DialogTutupKunjungan;
