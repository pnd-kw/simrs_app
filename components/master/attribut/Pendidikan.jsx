import Container from "@/components/Container";
import PendidikanComp from "./components/pendidikan/PendidikanComp";

const Pendidikan = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <PendidikanComp />
      </div>
    </>
  );
  return (
    <Container
      title="pendidikan"
      topContent={topContent}
      height={"min-h-screen"}
    />
  );
};

export default Pendidikan;
