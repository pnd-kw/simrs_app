import DialogDetailStatusJkn from "@/components/registrasi/kunjungan_rajal/components/DialogDetailStatusJkn";
import { Button } from "@/components/ui/button";
import useDialog from "@/hooks/ui/use-dialog";
import { Icon } from "@iconify/react";

const StatusKirimAntrianOnline = ({ dataAntrian, handleUpdateDataAntrian, rajalRsData }) => {
  const { open } = useDialog();

  const statusJkn = dataAntrian?.data[0]?.status_jkn;
  const remarkJkn = dataAntrian?.data[0]?.remark_jkn;

  if (statusJkn === 0) {
    return (
      <div className="flex w-full min-h-[10vh] items-center py-2 mb-4 rounded-sm bg-yellow2">
        <div className="flex w-full h-full gap-4 justify-between">
          <div className="flex flex-col w-full h-full justify-start px-4">
            <span className="text-xs text-white">
              Status Kirim Antrian Online
            </span>
          </div>
          <div className="flex w-full h-full justify-end px-4 gap-2">
            <Button type="button" variant="primary3" className="capitalize">
              <Icon icon="lets-icons:check-fill" />
              terkirim
            </Button>
            <Button type="button" variant="primary3" className="capitalize">
              <Icon icon="material-symbols:refresh" />
              kirim ulang
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (statusJkn === 1) {
    return (
      <div className="flex w-full min-h-[10vh] items-center py-2 mb-4 rounded-sm bg-primary1">
        <div className="flex w-full h-full gap-4 justify-between">
          <div className="flex flex-col w-full h-full justify-start px-4">
            <span className="text-xs text-white">
              Status Kirim Antrian Online
            </span>
            <span className="text-white font-semibold text-md">
              {remarkJkn}
            </span>
          </div>
          <div className="flex w-full h-full justify-end px-4 gap-2">
            <Button
              type="button"
              variant="primary3"
              className="capitalize hover:bg-primary2"
              onClick={() =>
                open({
                  minWidth: "min-w-[60vw]",
                  contentTitle: "Detail Status",
                  component: DialogDetailStatusJkn,
                  props: {
                    updatedTime: rajalRsData?.tanggal_registrasi,
                  },
                })
              }
            >
              <Icon icon="lets-icons:check-fill" />
              terkirim
            </Button>
          </div>
        </div>
      </div>
    );
  } else if (statusJkn === 2) {
    return (
      <div className="flex w-full min-h-[10vh] items-center py-2 mb-4 rounded-sm bg-red3">
        <div className="flex w-full h-full gap-4 justify-between">
          <div className="flex flex-col w-full h-full justify-start px-4">
            <span className="text-xs text-white">
              Status Kirim Antrian Online
            </span>
            <span className="text-white font-semibold text-md">
              {remarkJkn}
            </span>
          </div>
          <div className="flex w-full h-full justify-end px-4 gap-2">
            <Button
              type="button"
              variant="white"
              className="rounded-md text-xs text-red1 normal-case"
              onClick={() =>
                open({
                  minWidth: "min-w-[60vw]",
                  contentTitle: "Detail Status",
                  component: DialogDetailStatusJkn,
                  props: {
                    updatedTime: rajalRsData?.tanggal_registrasi,
                  },
                })
              }
            >
              <Icon icon="carbon:close-filled" />
              Gagal Terkirim ke JKN
            </Button>
            <Button
              type="button"
              variant="primary3"
              className="capitalize hover:bg-primary2"
              onClick={() =>
                handleUpdateDataAntrian({
                  id: dataAntrian?.data[0]?.id,
                  registration_id: dataAntrian?.data[0]?.registration_id,
                })
              }
            >
              <Icon icon="material-symbols:refresh" />
              kirim ulang
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StatusKirimAntrianOnline;
