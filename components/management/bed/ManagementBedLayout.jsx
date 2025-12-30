import Container from "@/components/Container";
import { useBedManagementTabStore } from "@/stores/management/bed/useBedManagementStore";
import ManagementBedComponents from "./components/ManagementBedComponents";
import SearchHistoriBed from "./components/histori_bed/SearchHistoriBed";
import SearchMonitoringBed from "./components/monitoring_bed/SearchMonitoringBed";
import VisualisasiLayout from "./components/visualisasi/VisualisasiLayout";

const ManagemenetBedLayout = () => {
  const selectedTab = useBedManagementTabStore((state) => state.selectedTab);
  const selectedTabName = useBedManagementTabStore(
    (state) => state.selectedTabName
  );

  const topContent = (
    <>
      <div className="w-full h-full">
        <ManagementBedComponents />
      </div>
    </>
  );

  const bottomContent =
    selectedTab === 0 ? (
      <div className="w-full h-full">
        <SearchMonitoringBed />
      </div>
    ) : selectedTab === 1 ? (
      <div className="w-full h-full">
        <SearchHistoriBed />
      </div>
    ) : (
      <div className="w-full h-full">
        <VisualisasiLayout />
      </div>
    );

  return (
    <Container
      title={selectedTabName}
      topContent={topContent}
      bottomContent={bottomContent}
    />
  );
};

export default ManagemenetBedLayout;
