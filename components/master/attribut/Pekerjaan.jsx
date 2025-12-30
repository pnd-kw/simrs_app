import Container from "@/components/Container";
import PekerjaanComp from "./components/penanggung_jawab/PenanggungJawabComp";

const Pekerjaan = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <PekerjaanComp />
      </div>
    </>
  );
  return (
    <Container
      title="pekerjaan"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};

export default Pekerjaan;
