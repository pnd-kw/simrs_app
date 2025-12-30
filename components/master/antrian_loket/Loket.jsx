import Container from "@/components/Container";
import LoketComp from "./components/loket/LoketComp";

const Loket = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <LoketComp />
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

export default Loket;
