import Container from "@/components/Container";
import JenisRawatComp from "./components/jenis_rawat/JenisRawatComp";

const JenisRawat = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <JenisRawatComp />
      </div>
    </>
  );
  return (
    <Container
      title="jenis rawat"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};

export default JenisRawat;
