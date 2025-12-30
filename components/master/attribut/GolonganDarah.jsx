import Container from "@/components/Container";
import GolonganDarahComp from "./components/golongan_darah/GolonganDarahComp";

const GolonganDarah = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <GolonganDarahComp />
      </div>
    </>
  );
  return (
    <Container
      title="golongan darah"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};

export default GolonganDarah;
