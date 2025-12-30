import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useBedEditStore } from "@/stores/management/bed/useBedManagementStore";
import { formatDate } from "@/utils/tanggal/formatDate";
import { SheetMonitoringBed } from "./SheetMonitoringBed";
import { Button } from "@/components/ui/button";

export default function WaitingListCards() {
  const { bedWaiting } = useBedEditStore();

  return (
    <div className="space-y-1.5">
      {bedWaiting?.map((item, idx) => {
        const namaPasien =
          item?.data_kunjungan?.nama_pasien || item?.nama_pasien || "-";
        const noRm = item?.data_kunjungan?.no_rm || "-";
        const tanggal = formatDate(item?.date_start);

        return (
          <div
            key={item.id}
            className={cn(
              "flex justify-between items-center px-3 py-1.5 rounded-md text-sm",
              idx === 0 ? "bg-[#00AEEF] text-white" : "bg-gray-400 text-white"
            )}
          >
            <div className="flex flex-col leading-tight">
              <span className="font-semibold">{namaPasien}</span>
              <span className="text-[11px] opacity-90">
                {noRm} - {tanggal}
              </span>
            </div>

            <SheetMonitoringBed
              mode="edit"
              data={item}
              trigger={
                <Button variant="ghost" className='rounded-sm hover:bg-red1 hover:text-white'>
                  <Icon
                    icon="mdi:open-in-new"
                    className="text-base opacity-90 hover:scale-110 transition cursor-pointer"
                  />
                </Button>
              }
            />
          </div>
        );
      })}
    </div>
  );
}
