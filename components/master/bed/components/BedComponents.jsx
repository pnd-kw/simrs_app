import { Button } from "@/components/ui/button";
import { useBedTabStore } from "@/stores/master/useMasterStore";
import BedForm from "./Bed/BedForm";
import Kamar from "./Kamar/Kamar";
import KelasKamar from "./KelasKamar/KelasKamar";
import Ruang from "./Ruang/Ruang";
import GolKelasAplicare from "./GolKelasAplicare/GolKelasAplicare";
import RuangAplicaresRsOnline from "./ruang_aplicares_rs_online/RuangAplicaresRsOnline";
import GolRsOnline from "./gol_rs_online/GolRsOnline";

const tabMenu = [
  {
    key: 0,
    title: "bed",
    label: "Tempat Tidur",
  },
  {
    key: 1,
    title: "kls kamar",
    label: "Daftar Kelas Kamar",
  },
  {
    key: 2,
    title: "ruang",
    label: "daftar ruangan",
  },
  {
    key: 3,
    title: "kamar",
    label: "daftar kamar",
  },
  {
    key: 4,
    title: "gol kls aplicares",
    label: "daftar golongan kelas applicares",
  },
  {
    key: 5,
    title: "ruang aplicares & rs ol",
    label: "daftar ruang aplicares & rs online",
  },
  {
    key: 6,
    title: "gol kls rs ol",
    label: "daftar kls rs online",
  },
];

const BedComponents = () => {
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
      {selectedTab === 0 && <BedForm />}
      {selectedTab === 1 && <KelasKamar />}
      {selectedTab === 2 && <Ruang />}
      {selectedTab === 3 && <Kamar />}
      {selectedTab === 4 && <GolKelasAplicare />}
      {selectedTab === 5 && <RuangAplicaresRsOnline />}
      {selectedTab === 6 && <GolRsOnline />}
    </div>
  );
};

export default BedComponents;
