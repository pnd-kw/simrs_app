import Container from "@/components/Container";
import AgamaComp from "./components/agama/AgamaComp";

const Agama = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <AgamaComp />
      </div>
    </>
  );
  return (
    <Container
      title="agama"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};

export default Agama;
