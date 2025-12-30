import Container from "@/components/Container";
import MasterJenisHargaComp from "./components/MasterJenisHargaComp";

const MasterJenisHarga = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <MasterJenisHargaComp />
      </div>
    </>
  );
  return (
    <Container
      title="master jenis harga"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};

export default MasterJenisHarga;
