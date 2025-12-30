import { Button } from "@/components/ui/button";
import {
  useBedManagementTabStore,
} from "@/stores/management/bed/useBedManagementStore";
import {
  useKelasKamarStore,
  useListBedStore,
  useRuangListStore,
} from "@/stores/master/useMasterStore";
import { useEffect } from "react";
import HistoriBedForm from "./histori_bed/HistoriBedForm";
import MonitoringBedLayout from "./monitoring_bed/MonitoringBedLayout";

const tabMenu = [
  {
    key: 0,
    title: "monitoring",
    label: "data bed",
  },
  {
    key: 1,
    title: "histori",
    label: "detail histori",
  },
  {
    key: 2,
    title: "visualisasi",
    label: "visualisasi",
  },
];

const ManagementBedComponents = () => {
  const { selectedTab, setSelectedTab } = useBedManagementTabStore();
  const { fetchListBed } = useListBedStore();
  const { fetchRuangList } = useRuangListStore();
  const { fetchKelasKamar } = useKelasKamarStore();

  useEffect(() => {
    fetchListBed();
    fetchKelasKamar();
    fetchRuangList();
  }, []);

  return (
    <div className="flex flex-col w-full items-center justify-center space-y-2">
      <div className="flex w-full  gap-2">
        {tabMenu.map((item) => (
          <div key={item.key} className="flex w-full py-2">
            <Button
              variant={
                selectedTab === item.key ? "primaryGradient" : "outlinedGreen1"
              }
              className="uppercase font-semibold rounded-sm w-full"
              onClick={() => setSelectedTab(item.key, item.label)}
            >
              {item.title}
            </Button>
          </div>
        ))}
      </div>
      {selectedTab === 0 && <MonitoringBedLayout />}
      {selectedTab === 1 && <HistoriBedForm />}
    </div>
  );
};

export default ManagementBedComponents;
