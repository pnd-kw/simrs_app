import { BouncingImage } from "@/utils/BouncingImage";
import { Button } from "./ui/button";
import useDialog from "@/hooks/ui/use-dialog";

const DialogLogout = ({ dialogImage, onLogout }) => {
  const { close } = useDialog();

  return (
    <div className="flex flex-col w-full items-center p-2">
      <div className="flex w-full min-h-[30vh] items-center justify-center mb-4">
        <BouncingImage
          image={dialogImage}
          alt="Logout warning image"
          width={150}
          height={150}
        />
      </div>
      <div className="flex w-full px-6 mb-4 items-center justify-center">
        <span className="text-center">
          Anda yakin ingin keluar dari aplikasi?
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
          <Button variant="red1" onClick={onLogout}>
            Keluar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DialogLogout;
