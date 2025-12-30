import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDialog from "@/hooks/ui/use-dialog";
import { useForm } from "react-hook-form";

const DialogInputIdAntrian = () => {
  const { close } = useDialog();
  const { register, handleSubmit } = useForm();

  const onSubmit = () => {};

  return (
    <div className="flex w-full items-center p-4">
      <div className="flex flex-col w-full pt-1">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          <div className="pb-2">
            <label htmlFor="id_antrian" className="label-style">
              id antrian loket
            </label>
            <Input
              {...register("id_antrian")}
              placeholder="ID Antrian Loket"
              className="rounded-md"
            />
          </div>
          <div>
            <Button variant="primary3" className="w-full capitalize">
              lanjutkan
            </Button>
          </div>
          <div>
            <Button
              variant="gray"
              className="w-full capitalize cursor-pointer"
              onClick={() => close()}
            >
              lanjutkan tanpa antrian
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DialogInputIdAntrian;
