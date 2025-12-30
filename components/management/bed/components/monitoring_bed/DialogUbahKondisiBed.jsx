"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useDialog from "@/hooks/ui/use-dialog";
import { useMonitoringBedStore } from "@/stores/management/bed/useBedManagementStore";
import { useBedEditStore, useVisualisasiBedStore } from "@/stores/management/bed/useBedManagementStore";

function StatusCard({ label, icon, selected, onClick }) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "flex items-center justify-center cursor-pointer transition-all duration-200 rounded-xl",
        "border-2 h-40 p-8 text-center",
        selected
          ? "bg-green-600 border-green-600 text-white"
          : "bg-white border-green-600 text-green-600 hover:bg-green-50"
      )}
    >
      <CardContent className="flex flex-col items-center justify-center gap-4 p-0">
        <div className="text-5xl">{icon}</div>
        <span className="font-bold uppercase text-lg">{label}</span>
      </CardContent>
    </Card>
  );
}

export default function DialogUbahKondisiBed({ source = "bedExist" }) {
  const [selected, setSelected] = useState(null);
  const { updateKondisiBed } = useMonitoringBedStore();
  const { bedExist } = useBedEditStore();
  const { detailBed } = useVisualisasiBedStore();
  const { close } = useDialog();

  const activeBed = source === "bedExist" ? bedExist : detailBed;

  useEffect(() => {
    if (activeBed) {
      setSelected(activeBed?.data_bed?.kondisi_bed);
    }
  }, [activeBed]);

  const statuses = [
    { id: 1, label: "Belum Siap", icon: <Icon icon="tabler:clock-question" width="48" height="48" /> },
    { id: 2, label: "Siap",       icon: <Icon icon="stash:user-check" width="48" height="48" /> },
    { id: 3, label: "Terpakai",   icon: <Icon icon="fa6-solid:bed-pulse" width="48" height="48" /> },
  ];

  const handleUpdate = async () => {
    try {
      await updateKondisiBed({
        id: activeBed?.data_bed?.id_bed,
        kondisi_bed: selected,
      });
      close();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-3 gap-6">
        {statuses.map((s) => (
          <StatusCard
            key={s.id}
            label={s.label}
            icon={s.icon}
            selected={selected === s.id}
            onClick={() => setSelected(s.id)}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleUpdate}
          disabled={!activeBed || !selected}
          className="bg-green-600 hover:bg-green-700"
        >
          Update Status
        </Button>
      </div>
    </div>
  );
}
