import Container from "@/components/Container";
import RuangLayananComp from "./components/ruang_layanan/RuangLayananComp";

const RuangLayanan = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <RuangLayananComp />
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

export default RuangLayanan;
