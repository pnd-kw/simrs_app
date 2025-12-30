import Container from "@/components/Container";
import PenanggungJawabComp from "./components/penanggung_jawab/PenanggungJawabComp";

const PenanggungJawab = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <PenanggungJawabComp />
      </div>
    </>
  );
  return (
    <Container
      title="penaggung jawab"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};

export default PenanggungJawab;
