import { useState } from "react";
import useDataAntrian from "@/hooks/kunjungan_rawat_jalan/use-data-antrian";
import { Button } from "../../../ui/button";
import StatusJknDialog from "../../components/StatusJknDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const DialogDetailStatusJkn = ({ updatedTime }) => {
  const { dataAntrian } = useDataAntrian();

  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);

  return (
    <>
      <div className="flex flex-col w-full h-full bg-grey2 p-4">
        <div className="grid grid-cols-2 w-full h-full gap-2">
          <div className="flex flex-col w-full h-full">
            <span className="text-xs">Request</span>
            <div className="w-full h-full border border-stone-300 rounded-sm bg-white">
              <pre className="text-xs p-2">
                {JSON.stringify(dataAntrian.metadata_jkn?.request, null, 2)}
              </pre>
            </div>
          </div>
          <div className="flex flex-col w-full h-full">
            <span className="text-xs">response</span>
            <div className="w-full h-full border border-stone-300 rounded-sm bg-white">
              <pre className="text-xs p-2">
                {JSON.stringify(dataAntrian.metadata_jkn?.response, null, 2)}
              </pre>
            </div>
          </div>
        </div>
        <div className="flex w-full min-h-[8vh] items-center justify-end gap-2 pt-4">
          <Button variant="red1">batal booking</Button>
          <Button variant="yellow1" onClick={openDialog}>
            status jkn
          </Button>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-w-[50vw] max-h-[90vh] overflow-y-auto">
          <VisuallyHidden>
            <DialogTitle></DialogTitle>
          </VisuallyHidden>
          <VisuallyHidden>
            <DialogDescription></DialogDescription>
          </VisuallyHidden>
          <div className="flex items-center pl-10 bg-primary1 w-full h-[6vh] text-white font-semibold">
            Detail Booking JKN
          </div>
          <StatusJknDialog
            idBooking={dataAntrian?.booking_id}
            updatedTime={updatedTime}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogDetailStatusJkn;
