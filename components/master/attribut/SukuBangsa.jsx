import Container from "@/components/Container";
import SukuBangsaComp from "./components/pendidikan/PendidikanComp";

const SukuBangsa = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <SukuBangsaComp />
      </div>
    </>
  );
  return (
    <Container
      title="suku bangsa"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};

export default SukuBangsa;
