import Container from "@/components/Container";
import { useBedTabStore } from "@/stores/master/useMasterStore";
import SearchMasterAsuransi from "./components/Asuransi/SearchMasterAsuransi";
import AsuransiComponents from "./components/AsuransiComponents";
import SearchMasterPerusahaan from "./components/perusahaan/SearchMasterPerusahaan";

const Asuransi = () => {
  const selectedTab = useBedTabStore((state) => state.selectedTab);
  const selectedTabName = useBedTabStore((state) => state.selectedTabName);

  const topContent = (
    <>
      <div className="w-full h-full">
        <AsuransiComponents />
      </div>
    </>
  );

  const bottomContent =
    selectedTab === 0 ? (
      <div className="w-full h-full">
        <SearchMasterAsuransi />
      </div>
    ) : selectedTab === 1 ? (
      <div className="w-full h-full">
        <SearchMasterPerusahaan />
      </div>
    ) : null;

  return (
    <Container
      title={selectedTabName}
      topContent={topContent}
      bottomContent={bottomContent}
    />
  );
};

export default Asuransi;
