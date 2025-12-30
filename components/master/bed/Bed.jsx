import Container from "@/components/Container";
import BedComponents from "./components/BedComponents";
import SearchMasterBed from "./components/Bed/SearchMasterBed";
import { useBedTabStore } from "@/stores/master/useMasterStore";

const Bed = () => {
  const selectedTab = useBedTabStore((state) => state.selectedTab);
  const selectedTabName = useBedTabStore((state) => state.selectedTabName);

  const topContent = (
    <>
      <div className="w-full h-full">
        <BedComponents />
      </div>
    </>
  );

  const bottomContent = selectedTab === 0 && (
    <div className="w-full h-full">
      <SearchMasterBed />
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

export default Bed;
