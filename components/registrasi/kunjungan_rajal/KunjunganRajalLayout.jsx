import Container from "@/components/Container";
import KunjunganRajalForm from "./components/KunjunganRajalForm";
import SearchKunjunganRajal from "./components/SearchKunjunganRajal";

const KunjunganRajalLayout = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <KunjunganRajalForm />
      </div>
    </>
  );

  const bottomContent = (
    <>
      <div className="w-full h-full overflow-x-auto">
        <SearchKunjunganRajal />
      </div>
    </>
  );

  return (
    <Container
      title="rawat jalan"
      topContent={topContent}
      bottomContent={bottomContent}
      height={"min-h-[65vh]"}
    />
  );
};

export default KunjunganRajalLayout;
