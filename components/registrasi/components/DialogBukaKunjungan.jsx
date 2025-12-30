import useDialog from "@/hooks/ui/use-dialog";
import { BouncingImage } from "@/utils/BouncingImage";
import { useCreate } from "@/hooks/mutation/use-create";
import { Button } from "@/components/ui/button";
import { bukaKunjungan } from "@/api/registrasi/bukaTutupBatalKunjungan";

const DialogBukaKunjungan = ({
  dialogImage,
  idKunjungan,
  setIsKunjunganTertutup,
}) => {
  const { close } = useDialog();

  const { mutate } = useCreate({
    apiFn: bukaKunjungan,
    queryKey: "kunjungan rajal",
    successMessage: "Berhasil membuka kunjungan.",
    errorMessage: "Gagal membuka kunjungan.",
  });

  const handleBukaKunjungan = async () => {
    const payload = { id: idKunjungan };

    mutate(payload, {
      onSuccess: (data) => {
        if (data?.data?.message === "Sukses") {
          close();
          setIsKunjunganTertutup(false);
        }
      },
    });
  };

  return (
    <div className="flex flex-col w-full items-center p-2">
      <div className="flex w-full min-h-[30vh] items-center justify-center mb-4">
        <BouncingImage
          image={dialogImage}
          alt="Buka kunjungan warning image"
          width={150}
          height={150}
        />
      </div>
      <div className="flex w-full px-6 mb-4 items-center justify-center">
        <span className="text-center">
          Apakah anda yakin ingin membuka kunjungan ini?
        </span>
      </div>
      <div className="flex w-full min-h-[5vh] items-center justify-center">
        <div className="flex w-full gap-4 justify-end">
          <Button
            variant="outline"
            className="capitalize"
            onClick={() => {
              close();
            }}
          >
            batal
          </Button>
          <Button
            variant="red1"
            className="capitalize"
            onClick={handleBukaKunjungan}
          >
            Ya, Buka Kunjungan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DialogBukaKunjungan;
