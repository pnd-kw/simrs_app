import Container from "@/components/Container";
import KunjunganIgdForm from "./components/KunjunganIgdForm";
import SearchKunjunganIgd from "./components/SearchKunjunganIgd";

const KunjunganIgdLayout = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <KunjunganIgdForm />
      </div>
    </>
  );

  const bottomContent = (
    <>
      <div className="w-full h-full overflow-x-auto">
        <SearchKunjunganIgd />
      </div>
    </>
  );

  return (
    <Container
      title="kunjungan igd"
      topContent={topContent}
      bottomContent={bottomContent}
      height={"min-h-[65vh]"}
    />
  );
};

export default KunjunganIgdLayout;
