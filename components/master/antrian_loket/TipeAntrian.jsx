import Container from "@/components/Container";
import RuangLayananComp from "./components/tipe_antrian/TipeAntrianComp";
import TipeAntrianComp from "./components/tipe_antrian/TipeAntrianComp";

const TipeAntrian = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <TipeAntrianComp />
      </div>
    </>
  );
  return (
    <Container
      title="ruang layanan"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};

export default TipeAntrian;
