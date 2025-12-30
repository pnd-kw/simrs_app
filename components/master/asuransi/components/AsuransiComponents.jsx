import { Button } from "@/components/ui/button";
import { useBedTabStore } from "@/stores/master/useMasterStore";
import AsuransiForm from "./Asuransi/AsuransiForm";
import PerusahaanForm from "./perusahaan/PerusahaanForm";

const tabMenu = [
  {
    key: 0,
    title: "asuransi",
    label: "Asuransi",
  },
  {
    key: 1,
    title: "Perusahaan",
    label: "Perusahaan",
  },
];

const AsuransiComponents = () => {
  const { selectedTab, setSelectedTab } = useBedTabStore();

  return (
    <div className="flex flex-col w-full items-center justify-center space-y-2">
      <div className="flex w-full px-2">
        {tabMenu.map((item) => (
          <div key={item.key} className="flex w-full px-2 py-2 gap-2">
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
      {selectedTab === 0 && <AsuransiForm />}
      {selectedTab === 1 && <PerusahaanForm />}
    </div>
  );
};

export default AsuransiComponents;
