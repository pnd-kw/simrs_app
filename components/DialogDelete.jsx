import { BouncingImage } from "@/utils/BouncingImage";
import { Button } from "./ui/button";
import useDialog from "@/hooks/ui/use-dialog";
import useDeleteTarget from "@/hooks/store/use-delete-target";

const DialogDelete = ({ dialogImage, data, prop1, prop2, onDelete }) => {
  const { clearId } = useDeleteTarget();
  const { close } = useDialog();

  return (
    <div className="flex flex-col w-full items-center p-2">
      <div className="flex w-full min-h-[30vh] items-center justify-center mb-4">
        <BouncingImage
          image={dialogImage}
          alt="Delete warning image"
          width={150}
          height={150}
        />
      </div>
      <div className="flex w-full px-6 mb-4 items-center justify-center">
        <span className="text-center">
          Anda yakin ingin menghapus record{" "}
          <b>
            {prop1} : {data.prop1}, {prop2} : {data.prop2}
          </b>{" "}
          ?
        </span>
      </div>
      <div className="flex w-full min-h-[5vh] items-center justify-center">
        <div className="flex w-full gap-4 justify-end">
          <Button
            variant="outline"
            className="capitalize"
            onClick={() => {
              close();
              clearId();
            }}
          >
            batal
          </Button>
          <Button variant="red1" onClick={onDelete}>
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DialogDelete;
