import Container from "@/components/Container";
import KunjunganRanapForm from "./components/KunjunganRanapForm";
import SearchKunjunganRanap from "./components/SearchKunjunganRanap";

const KunjunganRanapLayout = () => {
  const topContent = (
    <>
      <div className="w-full h-full">
        <KunjunganRanapForm />
      </div>
    </>
  );

  const bottomContent = (
    <>
      <div className="w-full h-full overflow-x-auto">
        <SearchKunjunganRanap />
      </div>
    </>
  );

  return (
    <Container
      title="rawat inap"
      topContent={topContent}
      bottomContent={bottomContent}
      height={"min-h-[65vh]"}
    />
  );
};

export default KunjunganRanapLayout;
